// Hashing
const sha512 = require('hash-anything').sha512
const bcrypt = require('bcrypt')
const saltRounds = 12

// Database Imports
const { User } = require('../models')

// Toriimon Imports
const { isExist } = require('./get')
const { randomString, hashString } = require('./crypto')

// Config
const config = require('../config/config.json')

const newAccount = (name, email, password, ip) => {
    return new Promise((resolve, reject) => {
        // Reject if an account already exists
        if (isExist(email) === true) {
            return reject((new Error({ name: 'AccountAlreadyExist', message: 'Account already exists in the database' })))
        }

        const hashedPassword = hashString(password)

        const NewUserSchema = {
            name: name,
            email: email,
            password: hashedPassword,
            lastseen_time: new Date(),
            ip_address: ip,
        }

        return resolve(User.create(NewUserSchema))
    })
}

const loginAccount = (email, password, ip) => {
    return new Promise((resolve, reject) => {
        // Hash password SHA512
        const incomingHashedPasswordSHA512 = sha512({
            a: password,
            b: config.toriimon.secretKey,
        })

        // Retrieve account object from database
        const RequestedUserAccount = User.findOne({ where: { email: email }, raw: true })

        // Compare bcrypt hashes
        // If RequestedUserAccount.password is undefined, process the comparison as is with undefined as a string.
        if (bcrypt.compareSync(incomingHashedPasswordSHA512, RequestedUserAccount.password.toString()) === true) {
            // Update last seen time
            User.update({ lastseen_time: new Date(), ip_address: ip }, { where: { email: email } })

            return resolve(true)
        }

        return reject((new Error({ name: 'AccountPasswordMismatch', message: 'Incoming password does not match the one stored in the database.' })))
    })
}

// a = async () => {
//     console.log(newAccount('a', 'a', 'a', 'a'))
// }
// a()
