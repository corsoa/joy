var mysql = require('mysql');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "ec2-54-198-236-2.compute-1.amazonaws.com",
    user: "joyuser",
    password: "JumpForJoy",
    database : 'joy'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;


