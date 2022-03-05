const mysql = require('mysql');
const config = require('./config');

const con = mysql.createConnection({
    host:"back2study-database.cp7iwtc61ifu.eu-west-3.rds.amazonaws.com",
    user:"admin",
    password: "Back2Studyadmin",
    database:"back2study"
});

con.connect(function(err) {

    if (err) throw err;

    con.query('USE back2study;');
    con.query('Select username from users where id=1;', function(error, result, fields) {
        console.log(result);
    });
    con.end();
});