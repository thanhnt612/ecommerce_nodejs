'use strict'

const { listNotifyByUser } = require('../services/notification.service.js')
const { SuccessResponse } = require('../status/success.response.js')

class NotificationController {
    listNotifyByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'List notification',
            metadata: await listNotifyByUser(req.query)
        }).send(res)
    }
}

module.exports = new NotificationController()