// This file contains every router file to load into express.

// Toriimon Middleware
const { requireAuthorisation, requireIsAdmin, forwardIfLoggedIn } = require('../toriimon_express/middleware')

module.exports = (app) => {
    app.use('/', forwardIfLoggedIn, require('./auth'))
    app.use('/api', require('./api'))
    app.use('/admin', requireAuthorisation, require('./admin'))

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
