'use strict'

const express = require("express")
const notificationController = require("../../controllers/notification.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const router = express.Router()

////////////////////////////// Middleware - Authentication \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.use(authenticationV2)

//List notification
router.get("", asyncHandler(notificationController.listNotifyByUser))


module.exports = router