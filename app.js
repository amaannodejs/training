const {
  connect,
  app,
  sequelize
} = require('./services/connection'),
  userRoutes = require('./routes/users')




//routes
app.use("/user", userRoutes)















sequelize.sync()
connect()