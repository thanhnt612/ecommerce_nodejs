'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Discount"
const COLLECTION_NAME = "Discounts"
// Declare the Schema of the Mongo model
const discountSchema = new Schema({
    discount_code: { type: String, require: true },
    discount_name: { type: String, require: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' },//"fixed_amount" by "1000$" and "percentage" by "50%"
    discount_value: { type: Number, require: true },//"1000$" or "50%"
    discount_start_date: { type: Date, require: true },
    discount_end_date: { type: Date, require: true },
    discount_max_use: { type: Number, require: true },//Maximum total usage of discount code
    discount_use_count: { type: Number, require: true },//Number of discount code which users used
    discount_user_used: { type: Array, default: [] },//Shows all users Who used this code
    discount_max_use_per_user: { type: Number, require: true },//Maximum usage of discount code per 1 user
    discount_min_order_value: { type: Number, require: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Boolean, default: true },
    discount_aplly_to: { type: String, require: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] }//Choose products for discount
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema)
