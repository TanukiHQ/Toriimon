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
    addToken,
}
