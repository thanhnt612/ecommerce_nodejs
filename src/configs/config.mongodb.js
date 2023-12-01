'use strict'

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 5003
    },
    db: {
        host: process.env.DEV_DB_HOST || "127.0.0.1",
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || "ecommerceDev"
    }
}

const prod = {
    app: {
        port: process.env.PROD_APP_HOST || 5004
    },
    db: {
        host: process.env.PROD_DB_HOST || "127.0.0.1",
        port: process.env.PROD_DB_PORT || 27017,
        name: process.env.PROD_DB_NAME || "ecommerceProd"
    }
}

const config = { dev, prod }
const env = process.env.NODE_ENV || "dev"
module.exports = config[env]