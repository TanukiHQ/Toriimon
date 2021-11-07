// Load environment
const config = require('./app/config/config.json')

// Express
const express = require('express')
const app = express()
app.use('/', express.static('public'))
app.use('/third_party', express.static('third_party'))

// cookieParser: Secret key for signing
const cookieParser = require('cookie-parser')
app.use(cookieParser(config.toriimon.secretKey))

// BodyParser
app.use(express.urlencoded({ extended: true }))

// Useragent
const useragent = require('express-useragent')
app.use(useragent.express())

// Csurf: CSRF protection
const csrf = require('csurf')
app.use(csrf({ cookie: true }))

// Rate limiting
const RateLimit = require('express-rate-limit')
app.use(new RateLimit({
    windowMs: 1*60*1000,
    max: 80,
    message: `<title>429 - ${config.app.name}</title><p style="font-family: Arial"><b>429 — Too many requests</b><br>Please try again in a moment.<p><p style="font-family: Arial"><small>Why am I seeing this: You are sending too many requests.<br>We limit the number of request a user can make to prevent DDOS attacks.</small></p>`,
}))

// Handlebars
const exphbs = require('express-handlebars')
app.set('views', [`views`])
app.set('view engine', 'hbs')
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: `views/layouts`,
    helpers: require('./app/helpers/handlebars'),
}))

// Toriimon Middleware
const { injectCurrentUser } = require('./app/toriimon_express/middleware')
app.use(injectCurrentUser)

// Routes
require('./app/routes/routes')(app)

const webserver = () => {
    app.listen(config.webserver.port, (err) => {
        if (err) {
            console.log(`\x1b[1m\x1b[2m[WEBSERVER] - \x1b[0m\x1b[1m\x1b[31m\x1b[5mFAILED\x1b[0m\x1b[31m: Unable to bind to port 5000. Could there possibly be another instance alive?\x1b[0m`)
            process.exit(1)
        }
        console.log(`\x1b[1m\x1b[2m[WEBSERVER] - \x1b[1m\x1b[34mOK\x1b[0m: Webserver binded on port ${config.webserver.port} | http://${config.webserver.webAddress}\x1b[0m`)
    })
}

// Load SQLize models
require('./app/models').sequelize.sync().then(() => {
    webserver()
})
