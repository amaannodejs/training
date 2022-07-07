require('dotenv').config()
const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  app = express(),

  userRoutes = require('./routes/users')







app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(bodyParser.json());






//routes
app.use("/user", userRoutes)

///testing
// const User=require('./models/user')
// //User.sync()
// //User.findOne("uid=1").then(data=>console.log(data))
// //User.create('name','username',"password",'email@email.com')
// oldUser={
//   uid: 1,
//   name: 'Amaan',
//   username: 'Amaan123',
//   password: '$2a$12$5TnwWyPLwYW7lMo8fC41/OnuPgF8QH0wx3aVQCiOEGm3XTrxjvwn.',
//   email: 'ansari.amaan26@gmail.com',
//   profileImage: 'public/images/2022-06-30T07:27:41.377Z-dont-give-up-quotes.jpeg'
// }
// User.update(oldUser,"Amaan232")
// const Token=require('./models/forgotPasswordToken')
//   Token.destroy('uid=213')
const Address=require('./models/address')
//Address.create()
////



const connect = async () => {
  try {

    await app.listen('80')
    console.log('80isUP')



  } catch (err) {
    console.log(err)
  }

}



connect()