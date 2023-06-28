const { gmailTransport } = require('../config/tranports.config.js')

class MailService {

    async recoverPassword(userEmail, token, fullUrl){
        if(!token){
            throw new HttpError('Missing token', HTTP_STATUS.BAD_REQUEST)
        }
        if(!fullUrl){
            throw new HttpError('Missing url', HTTP_STATUS.BAD_REQUEST)
        }
        const mailInfo = await gmailTransport.sendMail({
            from: 'Tienda de ropa <tiendaRopa@gmail.com>',
            to: userEmail,
            subject: 'Reinicio de contraseña',
            html: `
            <div>
                <h1>Reinicio de contraseña/h1>
                <p>Ingresa al siguiente enlace para ingresar una nueva contraseña</p>
                <a href=${fullUrl + '?token=' + token} >Ingresa aquí</a>
                <p>Si no has enviando este correo, ignóralo</p>
                <small>Tienda Ropa</small>
            </div>`,
            attachments: []
        })
        return mailInfo
    }

    async notifyDeletion(userEmail, userName){
        const mailInfo = await gmailTransport.sendMail({
            from: 'Tienda de ropa <tiendaRopa@gmail.com>',
            to: userEmail,
            subject: 'Desactivacion',
            html: `
            <div>
                <h1>Tu cuenta ha sido desactivada</h1>
                <p>Querido ${userName}, tu cuenta ha sido dada de baja</p>
                <small>Tienda Ropa</small>
            </div>`,
            attachments: []
        })
        return mailInfo
    }

    async productDeletion(userEmail, productTitle){
        const mailInfo = await gmailTransport.sendMail({
            from: 'Tienda de ropa <tiendaRopa@gmail.com>',
            to: userEmail,
            subject: 'Notificación de eliminación de producto',
            html: `
            <div>
                <h1>Un producto ha sido eliminado: ${productTitle}</h1>
                <small>Tienda Ropa</small>
            </div>`,
            attachments: []
        })
        return mailInfo
    }

}

module.exports = MailService