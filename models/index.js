
exports.db=require('../services/db')
exports.jwtkey = process.env.jwtkey
exports.jwt = require('jsonwebtoken')
exports.bcrypt = require('bcryptjs')
exports.fs = require('fs')