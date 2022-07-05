const { promises } = require('nodemailer/lib/xoauth2')

const mysql = require('mysql2'),
//console.log(process.env.sqlUsername,)

pool =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '9868439196',
    database: 'work2'
  }).promise()
exports.query=async(query)=>{
const result = await pool.execute(query)
if(!result){return []}
return result[0]
}