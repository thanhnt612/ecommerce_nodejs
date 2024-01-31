'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Resource'
const COLLECTION_NAME = 'Resources'

const resourceSchema = new Schema({
    source_name: { type: String, required: true },
    source_slug: { type: String, required: true },
    source_description: { type: String, default: '' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, resourceSchema)