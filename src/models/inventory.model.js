'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Inventory"
const COLLECTION_NAME = "Inventories"
// Declare the Schema of the Mongo model
const inventorySchema = new Schema({
    inventory_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    inventory_location: { type: String, default: 'unKnown' },
    inventory_stock: { type: Number, require: true },
    inventory_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inventory_reservation: { type: Array, default: [] }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}