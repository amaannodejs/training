require('dotenv').config()

const Sequelize = require('sequelize'),
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser')
app = express()

app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(bodyParser.json());










const connect = async () => {
  try {
    await sequelize.authenticate()
    app.listen(process.env.PORT || 80, () => {
      console.log('80isUP!')
    })
  } catch (err) {
    console.log(err)
  }

}
sequelize = new Sequelize('work', process.env.sqlUsername, process.env.sqlPassword, {
  host: 'localhost',
  dialect: 'mysql'
})
module.exports = {
  connect,
  sequelize,
  app
}