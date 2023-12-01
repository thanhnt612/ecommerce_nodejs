'use strict'

const StatusCode = {
    OKE: 200,
    CREATED: 201
}

const ReasonStatusCode = {
    OKE: 'Success',
    CREATED: "Created!"
}


class SuccessResponse {
    constructor({
        message,
        statusCode = StatusCode.OKE,
        reasonStatusCode = ReasonStatusCode.OKE,
        metadata = {}
    }) {
        this.message = !message ? ReasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}

class CREATED extends SuccessResponse {
    constructor({
        message,
        statusCode = StatusCode.CREATED,
        reasonStatusCode = ReasonStatusCode.CREATED,
        metadata
    }) {
        super({ message, statusCode, reasonStatusCode, metadata })
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessResponse
}