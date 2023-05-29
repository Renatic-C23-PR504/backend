const mysql = require('mysql');
const dbPool = mysql.createConnection({
   host: '34.101.152.116',
   user: 'root',
   database: 'main_db',
   password: '/dR/%prDH0I5r)F>',
});

module.exports = dbPool;
