const assert = require("chai").assert;
const chai = require("chai")

const dao = require("../userDAO");
const config =require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.databaseConfig);

const user = new dao(pool);

describe("UserDAO", function () {
    it("Con datos válidos debe devolver true", function(){
        let usuario = {
            correo: 'testemail@gmail.com',
            nombre: 'testusername',
            pass: '1234',
            pass2: '1234',
        };
        user.registro(usuario, function(errors, valid){
            chai.assert.equal(errors, null);
            chai.assert.equal(valid, true);
        })
    });

    it("Con usuario existente debe devolver false", function(){
        let usuario = {
            correo: 'sebo@gmail.com',
            nombre: 'SeboFromDeep',
            pass: 'sebopasswd',
            pass2: 'sebopasswd',
        };
        user.registro(usuario, function(errors, valid){
            chai.assert.equal(errors, null);
            chai.assert.equal(valid, false);
        })
    });
});

