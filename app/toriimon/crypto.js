// UUID & Hashing
const uuid = require('uuid')
const sha512 = require('hash-anything').sha512

// Random String generator
const randPass = require('secure-random-password')

const random = () => {
    // Generate and return random sha512 string
    return sha512({
        a: `${uuid.v5(uuid.v4(), uuid.v5(uuid.v4(), uuid.v4()))}${uuid.v5(uuid.v4(), uuid.v5(uuid.v4(), uuid.v4()))}${uuid.v5(uuid.v4(), uuid.v5(uuid.v4(), uuid.v4()))}`,
        b: randPass.randomPassword() + randPass.randomPassword() + (new Date()),
    })
}

const hashString = (str) => {
    // Hash password SHA512
    const hashedPasswordSHA512 = sha512({
        a: str,
        b: config.toriimon.secretKey,
    })

    // Further hash in bcrypt
    const hashedPasswordBCrypt = bcrypt.hashSync(hashedPasswordSHA512, saltRounds)

    return hashedPasswordBCrypt
}

module.exports = {
    randomString: random,
    hashString,
}
