'use strict'

const express = require("express")
const productController = require("../../controllers/product.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const router = express.Router()

//Search
router.get("/search/:keySearch", asyncHandler(productController.getListSearchProduct))
//Get All Product
router.get("", asyncHandler(productController.findAllProduct))
//Get Product Detail
router.get("/:productId", asyncHandler(productController.productDetail))


////////////////////////////// Middleware - Authentication \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.use(authenticationV2)

//New Product
router.post("", asyncHandler(productController.createProduct))
//Update Product
router.patch("/:productId", asyncHandler(productController.updateProduct))
//Publish Product
router.post("/publish/:id", asyncHandler(productController.publishProductByShop))
//UnPublish Product
router.post("/unpublish/:id", asyncHandler(productController.unPublishProductByShop))


//Get All Draft Product
router.get("/draft/all", asyncHandler(productController.getAllDraftForShop))
//Get All Publish Product
router.get("/publish/all", asyncHandler(productController.getAllPublishForShop))

module.exports = router