'use strict'

const ProductService = require('../services/product.service')
const { OK, CREATED, SuccessResponse } = require('../status/success.response.js')


class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish new Product success!',
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Un Publish Product success!',
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    //Get list
    /**
     * @description Get all product for shop
     * @param {Number} limit 
     * @param {Number} skip
     * @param {JSON}  
     */
    getAllDraftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success!',
            metadata: await ProductService.findAllDraftForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Publish success!',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Search success!',
            metadata: await ProductService.searchProduct(req.params)
        }).send(res)
    }

    findAllProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get All Product success!',
            metadata: await ProductService.findAllProduct(req.query)
        }).send(res)
    }
    productDetail = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get Product success!',
            metadata: await ProductService.productDetail({
                product_id: req.params.productId
            })
        }).send(res)
    }
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Product success!',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
}
module.exports = new ProductController()