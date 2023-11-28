const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

// Middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
//Database

//Route
app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "Hello Everybody",
    })
})
//Handle Errorr

module.exports = app