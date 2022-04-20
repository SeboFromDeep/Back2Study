const assert = require("chai").assert;
const chai = require("chai");
const dao = require("../../js/userDAO");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const pool = mysql.createPool(config.databaseConfig);
const task = new dao(pool);


describe("Iniciar sesión correcto", function () {

    it("Correo y contraseña correctos", function() {
        let usuario = {
            correo: "testemail@gmail.com",
            pass: "1234",
        };
        task.login(usuario.correo, usuario.pass).then(value => {
            assert.equal(value.email, usuario.correo);
            assert.equal(value.password, usuario.pass);
        });
    });

});

describe("Iniciar sesión incorrecto", function () {

    it("Correo no registrado en la BD", function() {
        let usuario = {
            correo: "noregister@gmail.com",
            pass: "1234",
        };
        task.login(usuario.correo, usuario.pass).then(value => {
            assert.equal(value, false);
        });
    });

});

describe("Iniciar sesión incorrecto", function () {

    it("Correo registrado pero contraseña incorrecta", function() {
        let usuario = {
            correo: "testemail@gmail.com",
            pass: "4321",
        };
        task.login(usuario.correo, usuario.pass).then(value => {
            assert.equal(value, false);
        });
    });

});