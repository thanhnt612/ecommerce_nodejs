'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
    cart_state: {
        type: String,
        require: true,
        enum: ['active', 'completed', 'failed', 'pending']
    },
    cart_product: { type: Array, require: true, default: [] },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, require: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createOn',
        updatedAt: 'modifiOn'
    }
})

module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema)
}