'use strict'

const { BadRequestError, NotFoundError } = require('../status/error.response')
const discount = require('../models/discount.model')
const { findAllProductRepo } = require('../models/repositories/product.repo')
const { findAllDicountUnSelect, checkDiscountExist, findAllDicountSelect } = require('../models/repositories/discount.repo')


class DiscountService {
    static async createDiscount(payload) {
        const {
            code, start_date, end_date, is_active, shopId,
            min_order_value, product_ids, apply_to, name, description,
            type, value, max_use, use_count, max_use_per_user, user_used
        } = payload
        //Check time
        if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expired')
        }
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date')
        }
        //Create discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: shopId
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount existed')
        }

        const newDiscount = await discount.create({
            discount_code: code,
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_use: max_use,
            discount_use_count: use_count,
            discount_user_used: user_used,
            discount_max_use_per_user: max_use_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_aplly_to: apply_to,
            discount_product_ids: apply_to === 'all' ? [] : product_ids,
        })
        return newDiscount
    }

    static async updateDiscount() {

    }

    //Get list product by discount code for user
    static async getAllDiscountWithProduct({
        code, shopId, limit, page
    }) {
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: shopId
        }).lean()
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Dicount not exist')
        }
        const { discount_aplly_to, discount_product_ids } = foundDiscount
        let products
        if (discount_aplly_to === 'all') {
            products = await findAllProductRepo({
                filter: {
                    product_shop: shopId,
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_aplly_to === 'specific') {
            products = await findAllProductRepo({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    //Get list discount for user
    static async getAllDiscount({ limit, page, shopId }) {
        const foundDiscount = await findAllDicountSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: shopId,
                discount_is_active: true
            },
            select: ['discount_code', 'discount_name'],
            model: discount
        })
        return foundDiscount
    }

    //Apply Discount Code to Pruduct
    static async applyDiscountProduct({ codeId, userId, shopId, product }) {
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: shopId
            }
        })
        if (!foundDiscount) throw new NotFoundError(`Discount doesn't exist`);
        const {
            discount_is_active,
            discount_max_use,
            discount_min_order_value,
            discount_max_use_per_user,
            discount_user_used,
            discount_type,
            discount_end_date,
            discount_value
        } = foundDiscount
        if (!discount_is_active) throw new NotFoundError(`Discount expired`)
        if (!discount_max_use) throw new NotFoundError(`Discount are out`)
        if (new Date() > new Date(discount_end_date)) {
            throw new NotFoundError('Discount code has expired')
        }

        //Check the minimum value to use this dícount
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            totalOrder = product.reduce((total, product) => {
                return total + (product.quantity * product.price)
            }, 0)
            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`Discount requires a minimum order value of ${discount_min_order_value}`)
            }
        }

        if (discount_max_use_per_user > 0) {
            const userUseDiscount = discount_user_used.find(user => user.userId === userId)
            if (userUseDiscount) {

            }
        }

        //Check type discount is 'fixed_amount' or 'percentage' 
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    //Delete discount code
    static async deleteDiscount({ shopId, codeId }) {
        const delDiscount = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: shopId
        })
        return delDiscount
    }

    //Process discount code When cancel order
    static async cancelDiscount({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: shopId
            }
        })
        if (!foundDiscount) throw new NotFoundError(`Discount doesn't exist`)
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_user_used: userId
            },
            $inc: {
                discount_max_use: 1,
                discount_use_count: -1
            }
        })
        return result
    }
}

module.exports = DiscountService