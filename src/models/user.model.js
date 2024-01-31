'use strict'
//!dmbgum

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "User"
const COLLECTION_NAME = "Users"
// Declare the Schema of the Mongo model
const userSchema = new Schema({
    user_id: { type: Number, required: true },
    user_slug: { type: String, required: true },
    user_name: { type: String, default: '' },
    user_password: { type: String, default: '' },
    user_salf: { type: String, default: '' },
    user_email: { type: String, required: true },
    user_phone: { type: String, default: '' },
    user_gender: { type: String, default: '' },
    user_avatar: { type: String, default: '' },
    user_date_of_birth: { type: String, default: null },
    user_role: { type: Schema.Types.ObjectId, ref: 'Role' },
    user_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);