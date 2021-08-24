// Database Imports
const { User } = require('../models')

const isExist = async (email) => {
    const count = await User.count({
        where: {
            email: email,
        },
    })

    if (count > 1) {
        return true
    }

    return false
}

const getAccountByEmail = async (email) => {
    const user = await User.findOne({
        where: {
            email: email,
        },
        raw: true,
    })

    return user
}

const getAccountByID = async (uid) => {
    const user = await User.findOne({
        where: {
            id: uid,
        },
        raw: true,
    })
    return user
}

module.exports = {
    isExist,
    getAccountByEmail,
    getAccountByID,
}
