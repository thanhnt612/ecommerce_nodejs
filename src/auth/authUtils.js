'use strict'

const jwt = require('jsonwebtoken')
const asyncHandler = require("../helpers/asyncHandler")
const { AuthFailureError, NotFoundError } = require('../status/error.response')
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {

        //AccessToken
        const accessToken = await jwt.sign(payload, publicKey, { expiresIn: "2 days" })

        //RefreshToken
        const refreshToken = await jwt.sign(payload, privateKey, { expiresIn: "7 days" })

        //Verify data
        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`Error::`, err);
            } else {
                console.log(`Decode::`, decode);
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {

    }
}

const authentication = asyncHandler(async (req, res, next) => {

    //Check userId 
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request')

    //Get AccessToken
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not Found keyStore')

    //Verify Token
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decode = jwt.verify(accessToken, keyStore.publicKey)
        if (userId != decode.userId) throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await jwt.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}