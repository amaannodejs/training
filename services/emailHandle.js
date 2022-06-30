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
exports.sendMail = async (email, subject, body, cb) => {
  try {
    console.log(body)
    const info = await transporter.sendMail({
      from: '"Excellence Technologies" <amaannodejs@outlook.com>',
      to: email,
      subject: subject,
      text: "",
      html: body,
    })
    if (!info) {
      return cb(null, 'mail not sent')
    }
    return cb('email send successfully')

  } catch (err) {
    console.log(err)
  }


}