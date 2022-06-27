const nodemailer = require("nodemailer"),
emailUsername= process.env.emailUsername,
emailPassword= process.env.emailPassword,

transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
     // true for 465, false for other ports
    auth: {
      user: emailUsername, // generated ethereal user
      pass: emailPassword, // generated ethereal password
    },
  });
  exports.sendMail=(email,subject,body,cb)=>{
    console.log(email)
    transporter.sendMail({
        from: '"Excellence Technologies" <amaannodejs@outlook.com>', // sender address
        to: email, // list of receivers
        subject:subject, // Subject line
        text: "", // plain text body
        html: body, // html body
      }).then(info=>{
        if(!info){cb(null,'mail not sent')}
        cb('email send successfully')
      }).catch(err=>console.log(err))
      
   }
