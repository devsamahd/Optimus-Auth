const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const emailTemplateSource = fs.readFileSync(path.join(__dirname, "..", "public", "template.hbs"), "utf8")
const template = handlebars.compile(emailTemplateSource)
const date = new Date().getFullYear()
const sendConfirmationMail = async (email) => {
    const confirmationCode = Math.ceil((Math.random()*55555)+11111)
    const htmlToSend = template({code: confirmationCode, date})
    let err;
    const transporter  = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to:email,
        subject:'Confirmation Code for your brand new vyrally Account',
        html: htmlToSend
    }

    transporter.sendMail(mailOptions,(error)=>{
        if(error) err = error
    })

    if(!err) return confirmationCode
}

module.exports = sendConfirmationMail