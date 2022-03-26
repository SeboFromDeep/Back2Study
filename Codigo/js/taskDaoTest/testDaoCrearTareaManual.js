const assert = require("chai").assert;
const chai = require("chai")

const dao = require("../taskDAO");
const config =require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.databaseConfig);

const user = new dao(pool);

describe("UserDAO", function () {
    it("Con una tarea en la en la misma franja horaria devuelve false", function(){
       
    });

    it("con una franja horaria vacía deja insertar la tarea", function(){
        
    });

});
