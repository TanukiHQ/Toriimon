// Config
const config = require('../config/config.json')

// NodeMailer
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport(config.toriimon.mailer)

// File system
const fs = require('fs')

// Handlebars
const Handlebars = require('handlebars')

// Email Templates
const emailTemplate = {
    'password': {
        'reset': Handlebars.compile(fs.readFileSync(__dirname + `/mail_templates/pwdreset.hbs`, 'utf8')),
        // 'change': Handlebars.compile(fs.readFileSync(`./mail_templates/pwdchange.hbs`, 'utf8')),
    },
    'confirmation': {
        'confirm': Handlebars.compile(fs.readFileSync(__dirname + `/mail_templates/confirmation.hbs`, 'utf8')),
    },
    'notification': {
        'newLogin': Handlebars.compile(fs.readFileSync(__dirname + `/mail_templates/newLogin.hbs`, 'utf8')),
    },
}

const sendMail = (destinationEmail, template, data) => {
    return new Promise((resolve, reject) => {
        let mailMessage = null
        let mailSubject = null

        // Parse data into template -- Can't think of a better way to do this.
        switch (template) {
        case 'passwordReset':
            mailSubject = config.toriimon.mailer.customisation.resetPassword.subject
            mailMessage = emailTemplate.password.reset(data)
            break
        case 'confirmation':
            mailSubject = config.toriimon.mailer.customisation.confirmation.subject
            mailMessage = emailTemplate.confirmation.confirm(data)
            break
        case 'notifNewLogin':
            mailSubject = config.toriimon.mailer.customisation.unknownLogin.subject
            mailMessage = emailTemplate.notification.newLogin(data)
            break
        default:
            return reject(new Error({ name: 'UnknownMailTemplate', message: `Mail template, ${template}, does not exist.` }))
        }

        // Send email
        transporter.sendMail({
            from: config.toriimon.mailer.fromAddress,
            to: destinationEmail,
            subject: mailSubject,
            html: mailMessage,
        }, (err, info) => {
            if (err) return reject(err)
            return resolve(info)
        })
    })
}

module.exports = {
    sendMail,
}
