const express = require('express')
const { loginAccount } = require('../toriimon/account')
const router = express.Router()

router.get('/', (req, res) => {
    return res.redirect(302, '/login')
})

router.get('/login', (req, res) => {
    const metadata = {
        meta: {
            title: 'Login',
        },
        csrfToken: req.csrfToken(),
    }
    res.render('login', metadata)
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    // Get client IP address
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()

    // Ignore post if email or password is missing
    if (email === undefined || password === undefined) return

    loginAccount(email, password, ip).then((sid) => {
        // Redirect to home page
        res.redirect('/LOGINOK')
    }).catch((err) => {
        return console.log(err.name)
    })
})

router.get('/register', (req, res) => {
    const metadata = {
        meta: {
            title: 'Register',
        },
    }
    res.render('register', metadata)
})


router.get('*', (req, res) => {
    const metadata = {
        meta: {
            title: '404',
            path: false,
        },
    }
    res.status = 404
    res.render('404', metadata)
})

module.exports = router
