// Hashing
const sha512 = require('hash-anything').sha512
const bcrypt = require('bcrypt')

// Database Imports
const { Token, Session } = require('../models')
const { Op } = require('sequelize')

// Toriimon Imports
const { isExist } = require('./get')
const { randomToken, hashString } = require('./crypto')

// Cron job
const cron = require('node-cron')

// Config
const config = require('../config/config.json')

const addSession = (uid, userAgent) => {
    const newSessionID = randomToken()

    Session.create({
        sid: newSessionID,
        uid: uid,
        device_info: JSON.stringify(userAgent),
        last_used: new Date(),
    })

    return newSessionID
}

const destroySession = (sid) => {
    return Session.destroy({
        where: {
            sid: sid,
        },
    })
}

const getUIDBySessionID = async (sid) => {
    const session = await Session.findOne({
        where: {
            sid: sid,
        },
    })

    if (!session) {
        return null
    }

    return session.uid
}

const destroyAllSessions = (uid) => {
    return Session.destroy({
        where: {
            uid: uid,
        },
    })
}

const addToken = (uid, tokenType) => {
    const newToken = randomToken()

    Token.create({
        token: newToken,
        type: tokenType,
        uid: uid,
    })

    return newToken
}

// Delete all expired session tokens (older than 30 days)
cron.schedule('0 0 * * *', () => {
    Session.destroy({
        where: {
            updatedAt: {
                [Op.lt]: new Date(Date.now() - (1000 * 60 * 60 * 24 * 30)), // 30 days
            },
        },
    })

    console.log('Midnight has passed. All sessions older than 30 days old have been flushed.')
})

module.exports = {
    addSession,
    destroySession,
    destroyAllSessions,
    getUIDBySessionID,
    addToken,
}
