'use strict'

const { inventory } = require("../inventory.model")

const insertInventory = async ({
    productId, shopId, stock, location = 'unKnown'
}) => {
    return await inventory.create({
        inventory_productId: productId,
        inventory_shopId: shopId,
        inventory_stock: stock,
        inventory_location: location
    })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inventory_productId: productId,
        inventory_stock: { $gte: quantity }
    }
    const update = {
        $inc: {
            inventory_stock: -quantity
        },
        $push: {
            inventory_reservation: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }
    const option = { upsert: true, new: true }
    return await inventory.updateOne(query, update, option)
}

module.exports = {
    insertInventory,
    reservationInventory
}