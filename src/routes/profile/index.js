'use strict'

const express = require("express")
const { roleAdmin, roleShop } = require("../../controllers/profile.controler")
const { grantAccess } = require("../../middlewares/rbac")
const router = express.Router()

//admin
router.get("/viewany", grantAccess('readAny', 'profile'), roleAdmin)

//shop
router.get("/viewown", grantAccess('readOwn', 'profile'), roleShop)

module.exports = router