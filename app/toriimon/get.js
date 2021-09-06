// Database Imports
const { User } = require('../models')

// const accountIsExist = async (email) => {
//     const count = await User.count({
//         where: {
//             email: email,
//         },
//     })

//     console.table([count])

//     if (count !== 0) {
//         return true
//     }

//     return false
// }

const getUserByEmail = async (email) => {
    const user = await User.findOne({
        where: {
            email: email,
        },
        raw: true,
    })

    return user
}

const getUserByID = async (uid) => {
    const user = await User.findOne({
        where: {
            id: uid,
        },
        raw: true,
    })
    return user
}

const getAttribute = (uid, attribute) => {
    return new Promise((resolve, reject) => {
        User.findOne({ where: { id: uid } }).then((user) => {
            if (!user) {
                return reject(ToriimonError(['AccountMissing', 'Requested account does not exist.']))
            }

            return resolve(user[attribute])
        })
    })
}

module.exports = {
    getUserByEmail,
    getUserByID,
    getAttribute,
}
