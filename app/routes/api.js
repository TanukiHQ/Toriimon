const express = require('express')
const { loginAccount, newAccount } = require('../toriimon/account')
const router = express.Router()

const { ToriimonCookie } = require('../helpers/cookie_options')
const { destroySession, destroyAllSessions } = require('../toriimon/tokens_sessions')

// TODO: Ensure authenticated before allowing access to routes here.

router.post('/logout', async (req, res) => {
    const { sid, isAllSessions = false } = req.query

    // Check whether query exists
    if (!sid) {
        return res.status(400).json({
            status: 400,
            error: '\'sid\' parameter missing.',
        })
    }

    if (isAllSessions) {
        destroySession(sid)
    } else {
        const uid = await getUIDBySessionID(sid)
        destroyAllSessions(uid)
    }

    return res.status(202).json({
        status: 202,
        message: 'Request accepted.',
    })
})

module.exports = router
