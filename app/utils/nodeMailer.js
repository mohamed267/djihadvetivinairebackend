"use strict";
const nodemailer = require("nodemailer");
const emailTemplate = require("../assets/verification_email")



// async..await is not allowed in global scope, must use a wrapper
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "freeclass.app.test@gmail.com",
        pass: "kheotaeduzpybjog",
    },
});


exports.sendEmail  = async (email, subject  , template  ,   data) => {
    console.log("template is " + emailTemplate(template,data))
    console.log("email ", email)
    let info = await transporter.sendMail({
        from: '"email verification" <freeclass.app.test@gmail.com>', // sender address
        to: email, // list of receivers
        subject, // Subject line
        text: "", // plain text body
        html: emailTemplate(template,data), // html body
    });
    console.log(info)
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}




exports.sendVerificationCode = async (email, code, subject, text) => {
    console.log("emal ", email, code)
    let info = await transporter.sendMail({
        from: '"email verification" <freeclass.app.test@gmail.com>', // sender address
        to: email, // list of receivers
        subject, // Subject line
        text: "", // plain text body
        html: verification_email(code, text), // html body
    });
    console.log(info)
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}




