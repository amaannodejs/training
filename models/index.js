//const Sequelize = require('sequelize')
// exports.sequelize = sequelize = new Sequelize('work', process.env.sqlUsername, process.env.sqlPassword, {
//   host: 'localhost',
//   dialect: 'mysql'
// })
//exports.Sequelize = Sequelize
exports.db=require('../services/db')
exports.jwtkey = process.env.jwtkey
exports.jwt = require('jsonwebtoken')
exports.bcrypt = require('bcryptjs')
exports.fs = require('fs')