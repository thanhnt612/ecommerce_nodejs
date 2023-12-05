'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const {
    findAllDraftRepo,
    publishProductRepo,
    findAllPublishRepo,
    unPublishProductRepo,
    searchProductRepo,
    findAllProductRepo,
    productDetailRepo,
    updateProductRepo
} = require('../models/repositories/product.repo')
const { BadRequestError } = require('../status/error.response')
const { removeUnCallObject, updateNestedObjectParse } = require('../utils')

class ProductFactory {
    static productRegistry = {}
    //Factory pattern to create Product
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    //New Product by Type
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).createProduct()
    }

    //Update Product by Type
    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).updateProduct(productId)
    }

    //Get list product draft
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftRepo({ query, limit, skip })
    }

    //Get list product publish
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishRepo({ query, limit, skip })
    }

    //Publish Product
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductRepo({ product_shop, product_id })
    }

    //UnPublish Product
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductRepo({ product_shop, product_id })
    }

    //Search Product
    static async searchProduct({ keySearch }) {
        return await searchProductRepo({ keySearch })
    }

    //Get All Product
    static async findAllProduct({ limit = 50, page = 1, sort = 'ctime', filter = { isPublished: true } }) {
        return await findAllProductRepo({
            limit, page, sort, filter, select: ['product_name', 'product_price', 'product_thumb']
        })
    }

    //Get Product Detail
    static async productDetail({ product_id }) {
        return await productDetailRepo({ product_id, unSelect: ["__v", "product_variation"] })
    }
}

//Parent
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }
    //Create Product
    async createProduct(productId) {
        return await product.create({ ...this, _id: productId })
    }
    //Update Product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductRepo({ model: product, productId, bodyUpdate })
    }
}

//Type - "Clothing"
class Clothing extends Product {
    async createProduct() {

        //Create product_attributes of Product
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('create new Clothing error')

        //Create Product
        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('create new Product error')
        return newProduct
    }
    async updateProduct(productId) {

        const objectParams = removeUnCallObject(this)
        //Check new input product_attributes on Product
        if (objectParams.product_attributes) {
            await updateProductRepo({
                model: clothing,
                productId,
                bodyUpdate: updateNestedObjectParse(objectParams.product_attributes)
            })
        }

        //Update Product
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
        return updateProduct
    }
}

//Type - "Electronics"
class Electronics extends Product {
    async createProduct() {
        //Create product_attributes of Product
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('create new Clothing error')
        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('create new Product error')
        return newProduct
    }
}

//Type - "Furniture"
class Furniture extends Product {
    async createProduct() {
        //Create product_attributes of Product
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('create new Clothing error')
        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('create new Product error')
        return newProduct
    }
}

//Define product type
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory