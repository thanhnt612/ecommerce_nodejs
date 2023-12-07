'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

//Transforms a list of key-value pairs into an object.
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(val => [val, 1]))
}

const unSelectData = (select = []) => {
    return Object.fromEntries(select.map(val => [val, 0]))
}

const removeUnCallObject = (object) => {
    Object.keys(object).forEach(val => {
        if (object[val] == null) {
            delete object[val]
        }
    })
    return object
}
const updateNestedObjectParse = object => {
    const final = {};
    Object.keys(object || {}).forEach(ele => {
        if (typeof object[ele] === 'object' && !Array.isArray(ele)) {
            const response = updateNestedObjectParse(object[ele])
            Object.keys(response).forEach(val => {
                final[`${ele}.${val}`] = response[val]
            })
        } else {
            final[ele] = object[ele]
        }
    })
    return final;
}

const convertObjectId = id => Types.ObjectId(id)

module.exports = {
    getInfoData,
    getSelectData,
    unSelectData,
    removeUnCallObject,
    updateNestedObjectParse,
    convertObjectId
}