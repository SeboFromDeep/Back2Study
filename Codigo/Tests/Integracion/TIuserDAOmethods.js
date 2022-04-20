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
        // antes de cada test insertamos al usuario que existe para poder ejecutarlos siempre
        let usuario_existe = {
            username: "MethodsTestDAOSI",
            email: "methodstestDAOsi@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_existe);
        // antes de cada test insertamos y borramos al usuario que no existe para poder ejecutarlos siempre
        let usuario_no_existe = {
            username: "MethodsTestDAONO",
            email: "methodstestDAOno@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_no_existe);
        let id_usuario_no_existe = dao_test.get_id_user(usuario_no_existe.email);
        dao_test.delete_user(id_usuario_no_existe);
    });

    after(function() {
        // después de cada test borramos al usuario que se ha insertado para el test
        let id_usuario_existe = dao_test.get_id_user(usuario_existe.email);
        dao_test.delete_user(id_usuario_existe.email);
    });

    describe("Existe usuario", function () {

        it("Ya existe un usuario con ese nombre", function () {
            task.existeUsuario(usuario_existe).then(value => {
                assert.equal(value, true);
            });
        });

        it("Ya existe un usuario con ese correo", function () {
            task.existeCorreo(usuario_existe).then(value => {
                assert.equal(value, true);
            });
        });

    });

    describe("No existe usuario", function () {

        it("No existe un usuario con ese nombre", function () {
            task.existeUsuario(usuario_no_existe).then(value => {
                assert.equal(value, false);
            });
        });

        it("No existe un usuario con ese correo", function () {
            task.existeCorreo(usuario_no_existe).then(value => {
                assert.equal(value, false);
            });
        });

    });

});