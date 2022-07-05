const mysql = require('mysql2'),

pool =  mysql.createConnection({
    host: 'localhost',
    user: process.env.dbUserName,
    password: process.env.dbPassword,
    database: 'work2'
  }).promise()
exports.query=async(query)=>{
const result = await pool.execute(query)
if(!result){return []}
return result[0]
}