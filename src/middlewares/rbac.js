'use strict'
const { roleList } = require('../services/rbac.service');
const { AuthFailureError } = require('../status/error.response');
const rbac = require('./role.middleware')
/**
 * 
 * @param {string} action // read,delete, update
 * @param {*} resource // profile
 */
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            rbac.setGrants(await roleList({
                userId: 0
            }))
            const role_name = req.query.role;
            const permission = rbac.can(role_name)[action](resource)
            if (!permission.granted) {
                throw new AuthFailureError(`You don't have enough permission`)
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    grantAccess
}