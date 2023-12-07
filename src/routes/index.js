'use strict'

const express = require("express")
const { apiKey, permission } = require("../auth/checkAuth")
const router = express.Router()

//Check Apikey
router.use(apiKey)
//Check permissions
router.use(permission('0000'))

router.use("/v1/api/discount", require('./discount'))
router.use("/v1/api/product", require('./product'))
router.use("/v1/api", require('./access'))

module.exports = router