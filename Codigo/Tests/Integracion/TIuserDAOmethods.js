const assert = require("chai").assert;
const chai = require("chai");
const dao = require("../../js/userDAO");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const pool = mysql.createPool(config.databaseConfig);
const task = new dao(pool);


// tests
describe("Existe usuario", function () {

    it("Ya existe un usuario con ese nombre", function () {
        let usuario = {
            nombre: "testusername",
            correo: "testemail@gmail.com",
            pass: "1234",
        };
        task.existeUsuario(usuario).then(value => {
            assert.equal(value, true);
        });
    });

    it("Ya existe un usuario con ese correo", function () {
        let usuario = {
            nombre: "testusername",
            correo: "testemail@gmail.com",
            pass: "1234",
        };
        task.existeCorreo(usuario).then(value => {
            assert.equal(value, true);
        });
    });

});

describe("No existe usuario", function () {

    it("No existe un usuario con ese nombre", function () {
        let usuario = {
            nombre: "paco",
            correo: "paco@gmail.com",
            pass: "1234",
        };
        task.existeUsuario(usuario).then(value => {
            assert.equal(value, false);
        });
    });

    it("No existe un usuario con ese correo", function () {
        let usuario = {
            nombre: "paco",
            correo: "paco@gmail.com",
            pass: "1234",
        };
        task.existeCorreo(usuario).then(value => {
            assert.equal(value, false);
        });
    });

});