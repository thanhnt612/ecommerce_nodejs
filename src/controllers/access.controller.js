'use strict'

const AccessService = require("../services/access.service")
const { OK, CREATED, SuccessResponse } = require('../status/success.response.js')


class AccessController {
    handlerRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get Token Success !!!',
            metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        }).send(res)
    }
    logOut = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout Success!",
            metadata: await AccessService.logOut(req.keyStore)
        }).send(res)
    }
    logIn = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.logIn(req.body)
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
}
module.exports = new AccessController()