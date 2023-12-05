'use strict'

const express = require("express")
const accessController = require("../../controllers/access.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const router = express.Router()

//Sign Up
router.post("/shop/signup", asyncHandler(accessController.signUp))
//Log In
router.post("/shop/login", asyncHandler(accessController.logIn))

///////////////////// Authentication \\\\\\\\\\\\\\\\\\\\\\\\\\
router.use(authenticationV2)

//Log Out
router.post("/shop/logout", asyncHandler(accessController.logOut))

//Handler Refresh Token
router.post("/shop/handlerRefreshToken", asyncHandler(accessController.handlerRefreshToken))

module.exports = router