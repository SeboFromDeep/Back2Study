const chai = require("chai")
const config =require("../config");
const mysql = require("mysql");

const con = mysql.createConnection({
    host:"back2study-database.cp7iwtc61ifu.eu-west-3.rds.amazonaws.com",
    user:"admin",
    password: "Back2Studyadmin",
    database:"back2study"
});


before(function(done) {


        con.connect(function(err) {

            if (err) throw err;
        
            con.query('USE back2study;');
            con.query('Truncate table users', function(error, result, fields) {
                console.log(result);
            });
            con.end();
        });

    done()
 })