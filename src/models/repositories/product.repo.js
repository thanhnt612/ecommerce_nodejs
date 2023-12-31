'use strict'

const { Types } = require('mongoose')
const { product, clothing, electronic, furniture } = require('../../models/product.model')
const { getSelectData, unSelectData } = require('../../utils')

const findAllDraftRepo = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishRepo = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const publishProductRepo = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    foundShop.isDraft = false
    foundShop.isPublished = true
    const { result } = await foundShop.updateOne(foundShop)
    return result
}

const unPublishProductRepo = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    foundShop.isDraft = true
    foundShop.isPublished = false
    const { result } = await foundShop.updateOne(foundShop)
    return result
}

const searchProductRepo = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const result = await product.find({
        isPublished: true,
        $text: { $search: regexSearch }
    },
        { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return result
}

const findAllProductRepo = async ({ limit, page, sort, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const allProduct = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return allProduct
}

const productDetailRepo = async ({ product_id, unSelect }) => {
    const productDetail = await product.findById(product_id).select(unSelectData(unSelect))
    return productDetail
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query).
        populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const updateProductRepo = async ({
    productId,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })
}

const getProductByIdRepo = async (productId) => {
    return await product.findOne({ _id: productId }).lean()
}

const checkProductRepo = async (product) => {
    return await Promise.all(product.map(async prod => {
        const foundProduct = await getProductByIdRepo(prod.productId)
        if (foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: prod.quantity,
                productId: prod.productId,
            }
        }
    }))
}
module.exports = {
    findAllDraftRepo,
    findAllPublishRepo,
    publishProductRepo,
    unPublishProductRepo,
    searchProductRepo,
    findAllProductRepo,
    productDetailRepo,
    updateProductRepo,
    getProductByIdRepo,
    checkProductRepo
}

