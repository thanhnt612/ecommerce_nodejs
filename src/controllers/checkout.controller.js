'use strict'

const CheckoutService = require('../services/checkout.service.js')
const { SuccessResponse } = require('../status/success.response.js')

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: "Checkout Product",
            metadata: await CheckoutService.checkOutReview(req.body)
        }).send(res)
    }
}

module.exports = new CheckoutController()