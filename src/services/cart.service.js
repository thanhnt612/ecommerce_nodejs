'use strict'

const { cart } = require("../models/cart.model")
const { getProductByIdRepo } = require("../models/repositories/product.repo")
const { NotFoundError } = require('../status/error.response')

class CartService {
    // REPO //
    static async createCart({ userId, product }) {
        const query = {
            cart_userId: userId,
            cart_state: 'active',
        }
        const updateOrInsert = {
            $addToSet: {
                cart_product: product,
            }
        }
        const options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }
    static async updateCartQuantity({ userId, product }) {
        const { quantity, productId } = product
        const query = {
            cart_userId: userId,
            'cart_product.productId': productId,
            cart_state: 'active'
        }
        const update = {
            $inc: { 'cart_product.$.quantity': quantity }
        }
        const options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, update, options)
    }
    // END //

    static async addToCart({ userId, product = {} }) {
        //Check cart is exist 
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            //Create cart for user
            return await CartService.createCart({ userId, product })
        }

        if (!userCart.cart_product.length) {
            userCart.cart_product = [product]
            return await userCart.save()
        }

        //Cart product is already added => Update quantity
        return await CartService.updateCartQuantity({ userId, product })
    }
    static async addToCartV2({ userId, shop_order_id }) {
        const { productId, quantity, old_quantity } = shop_order_id[0]?.item_product[0]
        //Check product
        const foundProduct = await getProductByIdRepo(productId)
        if (!foundProduct) throw new NotFoundError('')
        //Compare cart
        if (foundProduct.product_shop.toString() !== shop_order_id[0].shopId) {
            throw new NotFoundError('Product do not belong to the shop')
        }
        return await CartService.updateCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }
    static async deleteCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' }
        const update = {
            $pull: {
                cart_product: {
                    productId
                }
            }
        }
        const deleteCart = await cart.updateOne(query, update)
        return deleteCart
    }
    static async getListCart({ userId }) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService

/**
 * Update Cart by change Quantity
{
    "userId": 1001,
    "shop_order_id": [
        {
            "shopId": "",
            "item_product": [
                {
                    "quantity",
                    "price",
                    "shopId",
                    "old_quantity",
                    "productId"
                }
            ]
        }
    ]
}
 */