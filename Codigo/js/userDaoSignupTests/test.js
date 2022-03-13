const assert = require("chai").assert;
const chai = require("chai")

const dao = require("../userDAO");
const config =require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.databaseConfig);

const user = new dao(pool);

describe("UserDAO", function () {
    it("Registro debería añadir una fila a la BBDD", function(){
        let usuario = {
            correo: 'testemail@gmail.com',
            nombre: 'testusername',
            pass: '1234',
            pass2: '1234',
        };
        user.registro(usuario, function(errors, username){
            chai.assert.equal(errors, null);
            chai.assert.equal(username, 'testusername');
        })
    });

    it("Registro con usuario existente", function(){
        let usuario = {
            correo: 'testemail@gmail.com',
            nombre: 'testusername',
            pass: '1234',
            pass2: '1234',
        };
        user.registro(usuario, function(errors, username){
            chai.assert.equal(errors, null);
            chai.assert.equal(username, 'testusername');
        })
    });
});

