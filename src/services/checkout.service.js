'user strict'

const { order } = require("../models/order.model")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductRepo } = require("../models/repositories/product.repo")
const { BadRequestError } = require("../status/error.response")
const { applyDiscountProduct } = require("./discount.service")
const { accquireLock, releaseLock } = require("./redis.service")

class CheckoutService {
    static async checkOutReview({
        cartId, userId, shop_order_id
    }) {
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError(`Cart doesn't exist`)
        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }
        const shop_order_id_new = []

        //Total Bill
        for (let i = 0; i < shop_order_id.length; i++) {
            const { shopId, shop_discount = [], item_product = [] } = shop_order_id[i];

            //Check product available
            const checkProductAvailable = await checkProductRepo(item_product)
            if (!checkProductAvailable[0]) throw new BadRequestError('Order wrong')
            const checkoutPrice = checkProductAvailable.reduce((cost, product) => {
                return cost + (product.quantity * product.price)
            }, 0)

            //Total Bill before process
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discount,
                priceRaw: checkoutPrice, //price per 1 item before apply discount
                priceApplyDiscount: checkoutPrice, // price per 1 item after apply discount 
                item_product: checkProductAvailable
            }

            //Check Discount is exist and valid 
            if (shop_discount.length > 0) {
                const { totalPrice = 0, discount = 0 } = await applyDiscountProduct({
                    codeId: shop_discount[0].codeId,
                    userId,
                    shopId,
                    product: checkProductAvailable
                })

                // Total discount price
                checkout_order.totalDiscount += discount

                //Process price when apply discount - Ex: Have 1 discount
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_id_new.push(itemCheckout)
        }
        return {
            shop_order_id,
            shop_order_id_new,
            checkout_order
        }
    }
    static async orderByUser({
        shop_order_id,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        //Get checkout information 
        const { shop_order_id_new, checkout_order } = await CheckoutService.checkOutReview({
            cartId,
            userId,
            shop_order_id
        })

        //Get product push keyLock to Optimistic-Key to process
        const product = shop_order_id_new.flatMap(order => order.item_product)
        console.log(`Product:::`, product);
        const acquireProduct = []
        for (let i = 0; i < product.length; i++) {
            const { productId, quantity } = product[i]
            const keyLock = await accquireLock(productId, quantity, cartId)
            accquireLock.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        //Checking if item exists in inventory
        if (acquireProduct.includes(false)) throw new BadRequestError("Some products have been updated, please return to the cart")
        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_product: shop_order_id_new
        })
        return newOrder
    }
}

module.exports = CheckoutService

/**
 * Checkout before payment / order
{
    "cartId",
    "userId",
    "shop_order_id": [
        {
            "shopId",
            "shop_discount": [],
            "item_product": [
                {
                    "price",
                    "quantity",
                    "productId"
                }
            ]
        },
        {
            "shopId",
            "shop_discount": [
                {
                    "shopId",
                    "discountId"",
                    "codeId"
                }
            ],
            "item_product": [
                {
                    "price",
                    "quantity",
                    "productId"
                }
            ]
        }
    ]
}
 */

