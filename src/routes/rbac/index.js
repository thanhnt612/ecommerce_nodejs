'use strict'

const express = require('express')
const {
    newRole,
    newResource,
    listRole,
    listResource
} = require('../../controllers/rabc.controller')
const asyncHandler = require("../../helpers/asyncHandler")
const router = express.Router()

router.post('/role', asyncHandler(newRole))
router.get('/list-role', asyncHandler(listRole))

router.post('/resource', asyncHandler(newResource))
router.get('/list-resource', asyncHandler(listResource))

module.exports = router