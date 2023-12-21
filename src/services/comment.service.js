'use strict'

const commentModel = require('../models/comment.model')
const { productDetailRepo } = require('../models/repositories/product.repo')
const { NotFoundError } = require('../status/error.response')

//Nested set model - Comment

/**
     Key feature: Comment service
     + Add comment
     + Get a list of comments
     + Delete a comment
 */

class CommentService {
    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new commentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })
        let rightValue
        if (parentCommentId) {
            //reply comment
            const parentComment = await commentModel.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('parent comment not found')
            rightValue = parentComment.comment_right
            //Update comments
            await commentModel.updateMany({
                comment_productId: productId,
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            await commentModel.updateMany({
                comment_productId: productId,
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })
        } else {
            //Comment non-reply
            //Find comment and return only comment_right fields
            /**
             * sort: { comment_right: -1 } - Get maximum value comment_right
             */
            const maxRightValue = await commentModel.findOne({
                comment_productId: productId,
            }, 'comment_right', { sort: { comment_right: -1 } })
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }
        //Insert to comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1
        await comment.save()
        return comment
    }
    static async getCommentByParentId({
        productId, parentCommentId = null, limit = 50, offset = 0
    }) {
        if (parentCommentId) {
            const parentComment = await commentModel.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('Not Found Comment for product')
            const comments = await commentModel.find({
                comment_productId: productId,
                comment_left: { $gt: parentComment.comment_left },
                comment_right: { $lte: parentComment.comment_right },
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })
            return comments
        }

        const comments = await commentModel.find({
            comment_productId: productId,
            comment_parentId: parentCommentId
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1
        })
        return comments
    }
    static async deleteComment({ commentId, productId }) {

        const foundProduct = await productDetailRepo({ product_id: productId })
        if (!foundProduct) throw new NotFoundError('Product not found')

        const comment = await commentModel.findById(commentId)
        if (!comment) throw new NotFoundError('Comment not found')

        //Define value left and right
        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        //Calculate witdth between left and right
        const witdth = rightValue - leftValue + 1

        //Delete all comment-sub in comment
        await commentModel.deleteMany({
            comment_productId: productId,
            comment_left: { $gte: leftValue, $lte: rightValue }
        })

        //Update the remaining comment
        await commentModel.updateMany({
            comment_productId: productId,
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_right: -witdth }
        })

         await commentModel.updateMany({
            comment_productId: productId,
            comment_left: { $gt: rightValue }
        }, {
            $inc: { comment_left: -witdth }
        })
        return true
    }
}

module.exports = CommentService