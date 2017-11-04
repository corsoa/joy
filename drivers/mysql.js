'use strict';
const mysql = require('mysql');

var connection = mysql.createConnection({
   host: process.env.MYSQL_HOST,
   user: process.env.MYSQL_USER,
   password: process.env.MYSQL_PASSWORD,
   database : process.env.MYSQL_DB || 'joy',
   debug: process.env.MYSQL_DEBUG || false
});

connection.connect(function(err) {
   if (err) {
     throw err;
   }
});

module.exports = connection;
