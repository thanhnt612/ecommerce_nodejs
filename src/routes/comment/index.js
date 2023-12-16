'use strict'

const express = require("express")
const commentController = require("../../controllers/comment.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const router = express.Router()

////////////////////////////// Middleware - Authentication \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.use(authenticationV2)

//New Comment
router.post("", asyncHandler(commentController.createComment))

//Get Comment
router.get("", asyncHandler(commentController.getCommentByParentId))

//Get Comment
router.delete("", asyncHandler(commentController.deleteComment))


module.exports = router