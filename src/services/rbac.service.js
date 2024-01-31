'use strict'

const resourceModel = require('../models/resource.model')
const roleModel = require('../models/role.model')

/**
 * New resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */
const createResource = async ({
    name = 'profile',
    slug = 'p00001',
    description = ''
}) => {
    try {
        //Check name or slug exists
        //New resource
        const resource = await resourceModel.create({
            source_name: name,
            source_slug: slug,
            source_description: description,
        })
        return resource
    } catch (error) {
        return error
    }
}

const resourceList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = ''
}) => {
    try {
        //Check is Admin ?

        //Get list of resource
        const resources = await resourceModel.aggregate([
            {
                $project: {
                    _id: 0,
                    name: '$ource_name',
                    slug: '$source_slug',
                    description: '$source_description',
                    resourceId: '$_id',
                    createAt: 1
                }
            }
        ])
        return resources
    } catch (error) {
        return error
    }
}

const createRole = async ({
    name = 'shop',
    slug = 's00001',
    description = 'extend from shop or user',
    grants = []
}) => {
    try {
        //Check role exists

        //create role
        const role = await roleModel.create({
            role_name: name,
            role_slug: slug,
            role_description: description,
            role_grants: grants
        })
        return role
    } catch (error) {
        return error
    }
}

const roleList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = ''
}) => {
    try {

        const listRole = await roleModel.aggregate([
            {
                $unwind: '$role_grants'
            },
            {
                $lookup: {
                    from: 'Resources',
                    localField: 'role_grants.resource',
                    foreignField: '_id',
                    as: 'resource'
                }
            },
            {
                $unwind: '$resource'
            },
            {
                $project: {
                    role: '$role_name',
                    resource: '$resource.source_name',
                    action: '$role_grants.actions',
                    attributes: '$role_grants.attributes'
                }
            }, {
                $unwind: '$action'
            }, {
                $project: {
                    _id: 0,
                    role: 1,
                    resource: 1,
                    action: '$action',
                    attributes: 1
                }
            }
        ])
        return listRole
    } catch (error) {
        return error
    }
}

module.exports = {
    createResource,
    resourceList,
    createRole,
    roleList
}