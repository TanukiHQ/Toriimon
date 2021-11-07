const express = require('express')
const { loginAccount, newAccount } = require('../toriimon/account')
const router = express.Router()

const { ToriimonCookie } = require('../helpers/cookie_options')
const { forwardIfLoggedIn } = require('../toriimon_express/middleware')

router.get('/', (req, res) => {
    return res.redirect(302, '/login')
})

router.get('/login', forwardIfLoggedIn, (req, res) => {
    const metadata = {
        meta: {
            title: 'Login',
        },
        csrfToken: req.csrfToken(),
    }
    return res.render('auth/login', metadata)
})

router.post('/login', forwardIfLoggedIn, async (req, res) => {
    const { email, password } = req.body

    // Get client IP address
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()

    // Get client user agent
    const userAgent = req.useragent

    // Ignore post if email or password is missing
    if (email === '' || password === '') return

    loginAccount(email, password, ip, userAgent).then((sid) => {
        if (sid === null) {
            return res.redirect('/LOGINFAILED')
        }

        // Set cookie
        res.cookie('auth_token', sid, ToriimonCookie)

        // Redirect to home page
        return res.redirect('/LOGINOK')
    }).catch((err) => {
        console.log(err)
        return res.redirect('/LOGINFAILED')

        // TODO: Handle invalid credentials
        // Catch all errors regardless of code. Should have exactly only one exit point.
    })
})

router.get('/register', forwardIfLoggedIn, (req, res) => {
    const metadata = {
        meta: {
            title: 'Register',
        },
        csrfToken: req.csrfToken(),
    }
    return res.render('auth/register', metadata)
})

router.post('/register', forwardIfLoggedIn, (req, res) => {
    const { name, email, password } = req.body

    // Get client IP address
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()

    // Ignore post if name, email or password is missing
    if (name === '' || email === '' || password === '') return

    // Register account
    newAccount(name, email, password, ip).then((sid) => {
        if (sid === null) {
            return res.redirect('/REGISTERFAILED')
        }

        // Redirect to home page
        res.redirect('/REGISTEROK')
    }).catch((err) => {
        console.log(err)
        return res.redirect('/REGISTERFAILED')

        // TODO: Handle duplicate email error
    })
})

router.get('/logout', (req, res) => {
    logoutAccount(req.signedCookies.auth_token)

    res.clearCookie('auth_token')
    return res.redirect('/')
})

module.exports = router
