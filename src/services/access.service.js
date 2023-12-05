'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("node:crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../status/error.response")
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user;

        //Check Refresh Token is used => Delete
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something went wrong!!! Please relogin')
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('User not registered')

        //Check User
        const foundShop = findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('User not registered')

        //Generate new Token Pair
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        //Update token to Database
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user,
            tokens
        }
    }

    static logOut = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey
    }

    static logIn = async ({ email, password, refreshToken = null }) => {

        //Check email in database
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('User not registered')

        //Compare password
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication error')

        //Create private-key, public-key
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')

        //Generate tokens: AT and RT
        const { _id: userId } = foundShop
        const tokens = await createTokenPair(
            { userId, email },
            publicKey,
            privateKey
        )
        //Create and Update Key in Database
        await KeyTokenService.createKeyToken({
            userId,
            refreshToken: tokens.refreshToken,
            privateKey, publicKey
        })
        return {
            //getInfoData customize by Lodash
            shop: getInfoData({ fields: ["_id", "name", "email"], object: foundShop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        //Check email exist
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Error: Email is already exist')
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })
        if (newShop) {

            //Created PrivateKey, PublicKey
            const publicKey = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')

            //Create and save Public-Key to Database
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                return {
                    code: "xxx",
                    message: "keyStore error"
                }
                // throw new BadRequestError('Error: keyStore error')
            }

            //Generate tokens: AT and RT
            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            )
            return {
                code: 201,
                metadata: {
                    //getInfoData customize by Lodash
                    shop: getInfoData({
                        fields: ["_id", "name", "email"],
                        object: newShop
                    }),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null
        }
    }
}
module.exports = AccessService