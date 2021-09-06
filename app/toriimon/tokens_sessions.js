// Hashing
const sha512 = require('hash-anything').sha512
const bcrypt = require('bcrypt')

// Database Imports
const { Token, Session } = require('../models')

// Toriimon Imports
const { isExist } = require('./get')
const { randomToken, hashString } = require('./crypto')

// Config
const config = require('../config/config.json')

const addSession = (uid) => {
    const newSessionID = randomToken()

    Session.create({
        sid: newSessionID,
        uid: uid,
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

module.exports = {
    addSession,
    destroySession,
    destroyAllSessions,
    getUIDBySessionID,
    addToken,
}
