'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

/**
 * ORDER-001: order success
 * ORDER-002: order fail
 * PROMOTION-001: new promotion
 * SHOP-001: new product by User following
 */

const notificationSchema = new Schema({
    comment_userId: { type: Number, default: 1 },
    notify_type: {
        type: String,
        enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
        require: true
    },
    notify_senderId: { type: Schema.Types.ObjectId, require: true, ref: 'Shop' },
    notify_receiverId: { type: Number, require: true },
    notify_content: { type: String, require: true },
    notify_option: { type: Object, default: {} }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, notificationSchema)

