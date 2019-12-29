var config = require('../config/config');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host            : config.database.dbhost,
    user            : config.database.dbuser,
    password        : config.database.dbpassword,
    database        : config.database.name,
    port            : config.database.dbport
});

connection.connect();

module.exports = {
    connection: connection
};
