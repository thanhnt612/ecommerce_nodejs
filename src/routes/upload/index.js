'use strict'

const express = require("express")
const uploadController = require("../../controllers/upload.controller")
const { uploadMemory } = require('../../configs/multer.config')
const asyncHandler = require("../../helpers/asyncHandler")
const router = express.Router()

router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(uploadController.uploadImageFromS3))

module.exports = router