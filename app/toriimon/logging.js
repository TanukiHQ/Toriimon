// Database Imports
const { Log } = require('../models')

// Error
const ToriimonError = require('./toriimon_error')

const addLog = async (type, message, uid) => {
    if (uuid.validate(uid) === false || !type || !message) {
        throw new ToriimonError(['InvalidParametersError', 'One or more parameters are not valid.'])
    }

    return await Log.create({
        type: type,
        message: message,
        invoker: uid,
    })
}

module.exports = {
    addLog,
}
