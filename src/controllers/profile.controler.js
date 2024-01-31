'use strict'
const { SuccessResponse } = require('../status/success.response.js')
const dataUser = [
    {
        user_id: 1,
        user_name: 'John'
    },
    {
        user_id: 2,
        user_name: 'Alex'
    },
    {
        user_id: 3,
        user_name: 'Max'
    }
]
class ProfileControler {
    roleAdmin = async (req, res, next) => {
        new SuccessResponse({
            message: "view all user",
            metadata: dataUser
        }).send(res)
    }

    roleShop = async (req, res, next) => {
        new SuccessResponse({
            message: "view 1 user",
            metadata: {
                user_id: 3,
                user_name: 'Max'
            }
        }).send(res)
    }
}
module.exports = new ProfileControler()