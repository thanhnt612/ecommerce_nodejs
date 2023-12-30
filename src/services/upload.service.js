'use strict'

const {
    s3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} = require("../configs/s3.config")
const crypto = require('crypto')
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const randomImageName = () => crypto.randomBytes(16).toString('hex')
const urlImagePublic = `https://d1231bv564e1.cloudfront.net`
const uploadImageFromS3 = async ({ file }) => {
    try {
        const imageName = randomImageName()
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })
        const result = await s3.send(command)

        // const signedUrl = new GetObjectCommand({
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: imageName,
        // })

        // const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });
        const url = getSignedUrl({
            url: `${urlImagePublic}/${imageName}`,
            keyPairId: process.env.AWS_CLOUDFRONT_PUBLIC_KEY_ID,
            dateLessThan: new Date(Date.now() + 1000 * 60),
            privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY_ID,
        })
        return {
            url,
            result
        }
    } catch (error) {
        console.error(`Error upload image S3`, error)
    }
}

module.exports = {
    uploadImageFromS3
}
