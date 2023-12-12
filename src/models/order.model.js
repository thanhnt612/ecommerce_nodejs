'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = "Order"
const COLLECTION_NAME = "Orders"
// Declare the Schema of the Mongo model
const orderSchema = new Schema({
    order_userId: { type: Number, require: true },
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_product: { type: Array, require: true },
    order_trackingNumber: { type: String, default: '#000231654' },
    order_status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
        default: 'pending'
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}