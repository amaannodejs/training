const nodemailer = require("nodemailer"),
  emailUsername = process.env.emailUsername,
  emailPassword = process.env.emailPassword,

  transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,

    auth: {
      user: emailUsername,
      pass: emailPassword,
    },
  });
exports.sendMail = (email, subject, body, cb) => {

  transporter.sendMail({
    from: '"Excellence Technologies" <amaannodejs@outlook.com>',
    to: email,
    subject: subject,
    text: "",
    html: body,
  }).then(info => {
    if (!info) {
      cb(null, 'mail not sent')
    }
    cb('email send successfully')
  }).catch(err => console.log(err))

}