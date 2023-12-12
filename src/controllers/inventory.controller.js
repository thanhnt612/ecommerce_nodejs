'use strict'

const InventoryService = require('../services/inventory.service.js')
const { SuccessResponse } = require('../status/success.response.js')

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: "Checkout Product",
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

module.exports = new InventoryController()