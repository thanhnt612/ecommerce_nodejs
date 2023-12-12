'use strict'

const CartService = require('../services/cart.service.js')
const { SuccessResponse } = require('../status/success.response.js')

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new cart",
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }
    update = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new cart",
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new cart",
            metadata: await CartService.deleteCart(req.body)
        }).send(res)
    }
    listCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new cart",
            metadata: await CartService.getListCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()