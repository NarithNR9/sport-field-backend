require('dotenv').config()
const mysql = require('mysql2')

const pool = mysql.createPool({
    port: 3306,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.MYSQL_DB,
    connectionLimit: 10
})

module.exports = pool.promise();