const {
  nodemailer
} = require("./index"),
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
  return new Promise(async (resolve, reject) => {
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
        reject(new Error('mail not sent'))

      }
      resolve(true)


    } catch (err) {
      console.log(err)
    }
  })



}