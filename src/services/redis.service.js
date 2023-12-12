'use strict'

const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const accquireLock = async (productId, quantity, cartId) => {
    const key = `lock_2023_${productId}`
    const retryTime = 10
    const expireTime = 3000
    for (let i = 0; i < retryTime.length; i++) {
        const result = await setnxAsync(key, expireTime)
        console.log(`result::`, result);
        if (result === 1) {
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })
            console.log(`Reserve:::`, isReservation);
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }
            return null
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    accquireLock,
    releaseLock
}