"use strict";
const nodemailer = require("nodemailer");
const verification_email = require("../assets/verification_email")



// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "gmail",
        // host: "smtp.gmail.com",
        // port: 465,
        // secure: true, // true for 465, false for other ports
        auth: {
            user: "freeclass.app.test@gmail.com", // generated ethereal user
            pass: "Letsdoit8", // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"email verification" <freeclass.app.test@gmail.com>', // sender address
        to: "hamza0bendahmane@gmail.com", // list of receivers
        subject: "التحقق من البريد الالكتروني ✔", // Subject line
        text: "", // plain text body
        html: verification_email, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);