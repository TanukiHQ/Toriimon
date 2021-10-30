// This file contains every router file to load into express.

// Toriimon Middleware
const { requireAuthorisation, requireIsAdmin, forwardIfLoggedIn } = require('../toriimon_express/middleware')

module.exports = (app) => {
    app.use('/', require('./auth'))
    app.use('/api', require('./api'))
    app.use('/admin', requireAuthorisation, require('./admin'))
    app.get('/afterlogin', requireAuthorisation, (res, req) => {
        return res.send('You are logged in!')
    })

    // 404 Page
    app.get('*', (req, res) => {
        const metadata = {
            meta: {
                title: '404',
                path: false,
            },
        }
        res.status = 404
        return res.render('404', metadata)
    })
}
