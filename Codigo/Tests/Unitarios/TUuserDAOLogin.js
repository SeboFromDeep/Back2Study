const assert = require("chai").assert;
const chai = require("chai");
const dao = require("../../js/userDAO");
const testDAO = require("../testsDAOMethods");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const pool = mysql.createPool(config.databaseConfig);
const task = new dao(pool);
const dao_test = new testDAO(pool);


// tests
describe('hooks', function () {

    let usuario_reg, usuario_no_reg;

    before(function () {
        // antes de cada test insertamos ("registramos") un usuario para que pueda logearse
        usuario_reg = {
            username: "LoginTestDAOReg",
            email: "logintestDAOreg@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_reg);
        // antes de cada test insertamos y borramos al usuario que no está registrado para poder ejecutarlos siempre
        usuario_no_reg = {
            username: "LoginTestDAONoReg",
            email: "logintestDAOnoreg@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_no_reg);
        setTimeout(function () {
            dao_test.get_id_user(usuario_no_reg.email, cb_getID);
            function cb_getID(err, getID) {
                let id_usuario_no_reg = getID;
                dao_test.delete_user(id_usuario_no_reg);
            }
        }, 1000);
    });

    after(function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        setTimeout(function () {
            dao_test.get_id_user(usuario_reg.email, cb_getID);
            function cb_getID(err, getID) {
                let id_usuario_reg = getID;
                dao_test.delete_user(id_usuario_reg);
            }
        }, 1000);
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