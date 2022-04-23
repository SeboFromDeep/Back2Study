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

    let usuario_existe, usuario_no_existe;

    before(function () {
        // antes de cada test insertamos al usuario que existe para poder ejecutarlos siempre
        usuario_existe = {
            username: "MethodsTestDAOSI",
            email: "methodstestDAOsi@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_existe);
        // antes de cada test insertamos y borramos al usuario que no existe para poder ejecutarlos siempre
        usuario_no_existe = {
            username: "MethodsTestDAONO",
            email: "methodstestDAOno@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_no_existe);
        setTimeout(function () {
            dao_test.get_id_user(usuario_no_existe.email, cb_getID);
            function cb_getID(err, getID) {
                let id_usuario_no_existe = getID;
                dao_test.delete_user(id_usuario_no_existe);
            }
        }, 1000);
    });

    after(function () {
        // después de cada test borramos al usuario que se ha insertado para el test
        setTimeout(function () {
            dao_test.get_id_user(usuario_existe.email, cb_getID);
            function cb_getID(err, getID) {
                let id_usuario_existe = getID;
                dao_test.delete_user(id_usuario_existe);
            }
        }, 1000);
    });

    describe("Existe usuario", function () {

        it("Ya existe un usuario con ese nombre", function () {
            // para que sean los mismos atributos
            let usuario = {
                nombre: usuario_existe.username,
                correo: usuario_existe.email,
                pass: usuario_existe.password
            };
            task.existeUsuario(usuario).then(value => {
                assert.equal(value, true);
            });
        });

        it("Ya existe un usuario con ese correo", function () {
            // para que sean los mismos atributos
            let usuario = {
                nombre: usuario_existe.username,
                correo: usuario_existe.email,
                pass: usuario_existe.password
            };
            task.existeCorreo(usuario).then(value => {
                assert.equal(value, true);
            });
        });

    });

    describe("No existe usuario", function () {

        it("No existe un usuario con ese nombre", function () {
            // para que sean los mismos atributos
            let usuario = {
                nombre: usuario_no_existe.username,
                correo: usuario_no_existe.email,
                pass: usuario_no_existe.password
            };
            task.existeUsuario(usuario).then(value => {
                assert.equal(value, false);
            });
        });

        it("No existe un usuario con ese correo", function () {
            // para que sean los mismos atributos
            let usuario = {
                nombre: usuario_no_existe.username,
                correo: usuario_no_existe.email,
                pass: usuario_no_existe.password
            };
            task.existeCorreo(usuario).then(value => {
                assert.equal(value, false);
            });
        });

    });

});