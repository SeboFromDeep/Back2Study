const assert = require("chai").assert;
const chai = require("chai");
const dao = require("../../js/userDAO");
const testDAO = require("./testsDAOMethods");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const pool = mysql.createPool(config.databaseConfig);
const task = new dao(pool);
const dao_test = new testDAO(pool);


// tests
describe('hooks', function () {

    before(function () {
        // antes de cada test insertamos ("registramos") un usuario para que pueda logearse
        let usuario_reg = {
            username: "LoginTestReg",
            email: "logintestreg@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_reg);
        // antes de cada test insertamos y borramos al usuario que no está registrado para poder ejecutarlos siempre
        let usuario_no_reg = {
            username: "LoginTestNoReg",
            email: "logintestnoreg@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_no_reg);
        let id_usuario_no_reg = dao_test.get_id_user(usuario_no_reg.email)
        dao_test.delete_user(id_usuario_no_reg);
    });
    
    after(function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        dao_test.delete_user(usuario_reg.email);
    });

    describe("Iniciar sesión correcto", function () {

        it("Correo y contraseña correctos", function () {
            task.login(usuario_reg.email, usuario_reg.password).then(value => {
                assert.equal(value.email, usuario_reg.emai);
                assert.equal(value.password, usuario_reg.password);
            });
        });

    });

    describe("Iniciar sesión incorrecto", function () {

        it("Correo no registrado en la BD", function () {
            task.login(usuario_no_reg.email, usuario_no_reg.password).then(value => {
                assert.equal(value, false);
            });
        });

        it("Correo registrado pero contraseña incorrecta", function () {
            let wrong_pass = "4321";
            task.login(usuario_reg.email, wrong_pass).then(value => {
                assert.equal(value, false);
            });
        });

    });

});