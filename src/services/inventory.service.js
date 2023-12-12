'use strict'

const { inventory } = require("../models/inventory.model")
const { getProductByIdRepo } = require("../models/repositories/product.repo")
const { BadRequestError } = require("../status/error.response")

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = "114 Bui Quang La, Ward 12, Go Vap District, Ho Chi Minh City"
    }) {
        const product = await getProductByIdRepo(productId)
        if (!product) throw new BadRequestError(`The product doesn't exist`)
        const query = { inventory_shopId: shopId, inventory_productId: productId }
        const update = {
            $inc: {
                invetory_stock: stock
            },
            $set: {
                inventory_location: location
            }
        }
        const option = { upsert: true, new: true }
        return await inventory.findOneAndUpdate(query, update, option)
    }
}

module.exports = InventoryService