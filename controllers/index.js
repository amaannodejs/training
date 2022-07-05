exports.User = require('../models/user')
exports.Address = require('../models/address')
exports.ForgotPassword = require('../models/forgotPasswordToken'),
exports.fileHandler = require('../services/fileHandle')
exports.emailHandler = require('../services/emailHandle')
exports.jwt = require('jsonwebtoken')
exports.jwtkey = jwtkey = process.env.jwtkey