const mysql = require('mysql');
const dbPool = mysql.createConnection({
   host: process.env.DB_HOST,
   user: process.env.DB_USERNAME,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
});

module.exports = dbPool;
