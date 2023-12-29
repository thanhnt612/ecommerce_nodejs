'use strict'

const { uploadImageFromS3 } = require('../services/upload.service')
const { SuccessResponse } = require('../status/success.response.js')
const { BadRequestError } = require('../status/error.response.js')


class UploadController {
    uploadImageFromS3 = async (req, res, next) => {
        const { file } = req
        if (!file) {
            throw new BadRequestError('File missing')
        }
        new SuccessResponse({
            message: "upload successfully uploaded use S3Client",
            metadata: await uploadImageFromS3({
                file
            })
        }).send(res)
    }
}

module.exports = new UploadController()