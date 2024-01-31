'use strict'
//!dmbgum

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Role"
const COLLECTION_NAME = "Roles"
// Declare the Schema of the Mongo model
const roleSchema = new Schema({
    role_slug: { type: String, required: true },
    role_name: { type: String, default: 'user', enum: ['user', 'shop', 'admin'] },
    role_status: { type: String, default: 'active', enum: ['pending', 'active', 'block'] },
    role_description: { type: String, default: '' },
    role_grants: [
        {
            resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
            actions: [{ type: String, required: true }],
            attributes: { type: String, default: '*' }
        }
    ]
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, roleSchema);