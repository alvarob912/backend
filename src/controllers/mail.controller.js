const MailService = require('../services/mail.service.js')
const { SECRET_KEY } = require('../config/enviroment.config.js')
const { gmailTransport } = require('../config/tranports.config.js')
const { generateRecoveringToken, cookieExtractor } = require('../utils/session.utils.js')
const jwt = require("jsonwebtoken")

const mailService = new MailService()
class MailController {

    static async recoverPassword(req, res, next) {
        const userEmail = req.body.email
        const token = generateRecoveringToken(userEmail)
        const fullUrl = `${req.protocol}://${req.get('host')}/newpasswordform`
        try {
            const emailSent = await mailService.recoverPassword(userEmail, token, fullUrl)
            req.logger.info('email sent => ' + JSON.stringify(emailSent))
            return res.redirect('/login')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = MailController