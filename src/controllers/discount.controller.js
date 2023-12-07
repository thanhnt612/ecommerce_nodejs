'use strict'

const DiscountService = require('../services/discount.service')
const { OK, CREATED, SuccessResponse } = require('../status/success.response.js')

class DiscountController {
    createDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: "Successfull Discount Code Generation",
            metadata: await DiscountService.createDiscount({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }
    getAllDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: "Get List Discount Successfull",
            metadata: await DiscountService.getAllDiscount({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    applyDiscountProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Apply Discount Product Successfull",
            metadata: await DiscountService.applyDiscountProduct({
                ...req.body,
            })
        }).send(res)
    }
    getAllDiscountWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "All Discount",
            metadata: await DiscountService.getAllDiscountWithProduct({
                ...req.query,
            })
        }).send(res)
    }
}

module.exports = new DiscountController()