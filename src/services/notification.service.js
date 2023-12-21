'use strict'

const notifyModel = require("../models/notification.model")

const pushNotifyToSystem = async ({
    type = 'SHOP-001',
    receiverId = 1,
    senderId = 1,
    option = {}
}) => {
    let notify_content
    if (type === 'SHOP-001') {
        notify_content = `@ShopName has just added a product: @ProductName`
    } else if (type === 'PROMOTION-001') {
        notify_content = `@ShopName has just added a voucher: @VoucherName`
    }
    const newNotify = await notifyModel.create({
        notify_type: type,
        notify_content,
        notify_senderId: senderId,
        notify_receiverId: receiverId,
        notify_option: option
    })
    return newNotify
}

const listNotifyByUser = async ({
    userId = 1,
    type = 'ALL',
    isRead = 0
}) => {
    const match = { notify_receiverId: userId }
    if (type !== 'ALL') {
        match['notify_type'] = type
    }
    return await notifyModel.aggregate([
        {
            $match: match
        },
        {
            $project: {
                notify_type: 1,
                notify_senderId: 1,
                notify_receiverId: 1,
                notify_content: 
                // 1,
                {
                    $concat: [
                        {
                            $substr: ['$notify_option.shop_name', 0, -1]
                        },
                        ` has just added a product `,
                        {
                            $substr: ['$notify_option.product_name', 0, -1]
                        },
                    ]
                },
                notify_option: 1,
                createAt: 1
            }
        }
    ])
}

module.exports = {
    pushNotifyToSystem,
    listNotifyByUser
}