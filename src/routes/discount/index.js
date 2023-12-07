'use strict'

const express = require("express")
const discountController = require("../../controllers/discount.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const router = express.Router()

//Search
router.post("/apply", asyncHandler(discountController.applyDiscountProduct))
router.get("/list_product_code", asyncHandler(discountController.getAllDiscountWithProduct))

////////////////////////////// Middleware - Authentication \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.use(authenticationV2)

router.post('', asyncHandler(discountController.createDiscount))
router.get('', asyncHandler(discountController.getAllDiscount))

module.exports = router