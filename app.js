require('dotenv').config()
const Sequelize = require('sequelize'),
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),

  app = express(),

  userRoutes = require('./routes/users')







app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(bodyParser.json());







app.use("/user", userRoutes)





const connect = async () => {
  try {

    // await sequelize.authenticate()
    await app.listen('80')
    console.log('80isUP')



  } catch (err) {
    console.log(err)
  }

}


//sequelize.sync()
connect()