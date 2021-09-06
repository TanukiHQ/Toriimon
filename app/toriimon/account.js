// Hashing
const uuid = require('uuid')
const sha512 = require('hash-anything').sha512
const bcrypt = require('bcrypt')

// Database Imports
const { User } = require('../models')

// Toriimon Imports
const { getUserByEmail } = require('./get')
const { randomToken, hashString } = require('./crypto')
const { addToken, addSession } = require('./tokens_sessions')
const { sendMail } = require('./mailer')

// Config
const config = require('../config/config.json')

// Error
const ToriimonError = require('./toriimon_error')

const newAccount = (name, email, password, ip) => {
    return new Promise(async (resolve, reject) => {
        // Reject if an account already exists
        if (await getUserByEmail(email)) {
            return reject(new ToriimonError(['DuplicateAccountError', 'Account already exists in the database']))
        }

        // Hash password
        const hashedPassword = hashString(password)

        const NewUserSchema = {
            id: uuid.v4(),
            name: name,
            email: email,
            password: hashedPassword,
            lastseen_time: new Date(),
            ip_address: ip,
        }

        // const EmailData = {
        //     receiver: email,
        //     url: `https://${config.webserver.webAddress}/confirm?token=${addToken(NewUserSchema.id, 'EMAIL')}`,
        // }

        // sendMail(EmailData, 'confirmation')

        return resolve(User.create(NewUserSchema))
    })
}

const loginAccount = (email, password, ip) => {
    return new Promise(async (resolve, reject) => {
        // Hash password SHA512
        const incomingHashedPasswordSHA512 = sha512({
            a: password,
            b: config.toriimon.secretKey,
        })

        // Retrieve account object from database
        const RequestedUserAccount = await User.findOne({ where: { email: email }, raw: true })

        if (RequestedUserAccount === null) {
            return reject(new ToriimonError(['AccountNotExistError', 'Account does not exist']))
        }

        // Compare bcrypt hashes
        // If RequestedUserAccount.password is undefined, process the comparison as is with undefined as a string.
        if ((await bcrypt.compare(incomingHashedPasswordSHA512, RequestedUserAccount.password)) === true) {
            // Update last seen time
            User.update({ lastseen_time: new Date(), ip_address: ip }, { where: { email: email } })

            // Create new session token
            const sid = addSession(RequestedUserAccount.id)

            return resolve(sid)
        }

        return reject(new ToriimonError(['PasswordMismatchError', 'Incoming password does not match with stored.']))
    })
}

const destroyAccount = (uid) => {
    return new Promise((resolve, reject) => {
        User.destroy({ where: { id: uid } })
            .then(() => resolve(true))
            .catch((err) => reject(err))
    })
}

const setAttribute = (uid, attribute, value) => {
    return new Promise((resolve, reject) => {
        User.update({ [attribute]: value }, { where: { id: uid } })
            .then(() => resolve(true))
            .catch((err) => reject(err))
    })
}

module.exports = {
    newAccount,
    loginAccount,
    destroyAccount,
    setAttribute,
}
