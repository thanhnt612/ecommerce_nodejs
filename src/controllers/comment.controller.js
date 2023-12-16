'use strict'

const {
    createComment,
    getCommentByParentId,
    deleteComment
} = require('../services/comment.service')
const { SuccessResponse } = require('../status/success.response.js')

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'New Comment',
            metadata: await createComment(req.body)
        }).send(res)
    }
    getCommentByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'List Comment',
            metadata: await getCommentByParentId(req.query)
        }).send(res)
    }
    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete success',
            metadata: await deleteComment(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()