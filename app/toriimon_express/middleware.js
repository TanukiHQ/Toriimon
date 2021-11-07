const { getAttribute } = require('../toriimon/account')
const { getUserByID } = require('../toriimon/get')
const { getUIDBySessionID } = require('../toriimon/tokens_sessions')

const injectCurrentUser = async (req, res, next) => {
    // Check whether SID is present
    const sid = req.signedCookies.auth_token
    if (!sid) {
        res.user = null
        return next()
    }

    // Check whether SID is valid
    const uid = await getUIDBySessionID(sid)
    if (uid === null) {
        res.user = null
        return next()
    }

    // If all is well, req.user is set to the user object.
    req.user = await getUserByID(uid)

    // Update current session
    Session.update({
        last_used: new Date(),
    }, {
        where: {
            sid: sid,
        },
    })

    // Update last seen
    User.update({
        last_seen: new Date(),
    }, {
        where: {
            id: uid,
        },
    })

    return next()
}

const forwardIfLoggedIn = async (req, res, next) => {
    const sid = req.signedCookies.auth_token || 'undefined'

    // Redirect to authorised pages if the user is logged in.
    // TODO: Set redirect address to one in config
    if ((await getUIDBySessionID(sid))) {
        return res.redirect('/LOGINOK')
    }

    // If not loggedin, proceed.
    return next()
}

const requireAuthorisation = async (req, res, next) => {
    const sid = req.signedCookies.auth_token

    if (!sid) {
        console.log('SID missing')
    }

    if (!(await getUIDBySessionID(sid))) {
        console.log('SID invalid')
    }

    if (!sid || (await getUIDBySessionID(sid)) === null) {
        // return res.redirect('/login')
        return res.json({
            success: false,
            message: 'You are not logged in',
        })
    }

    // If all is well, proceed.
    return next()
}

const requireIsAdmin = async (req, res, next) => {
    const sid = req.signedCookies.auth_token

    // Only checks if the user has permissions to access.
    // Use together with requireAuthorisation to check log in status.
    const isAdminValue = await getAttribute(await getUIDBySessionID(sid), 'is_admin')

    if (isAdminValue === false) {
        const metadata = {
            meta: {
                title: '403',
            },
        }
        res.status = 403
        return res.render('403', metadata)
    }

    return next()
}

module.exports = {
    injectCurrentUser,
    forwardIfLoggedIn,
    requireAuthorisation,
    requireAuthorisation,
    requireIsAdmin,
}
