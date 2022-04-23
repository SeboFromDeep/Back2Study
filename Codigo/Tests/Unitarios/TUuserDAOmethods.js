const assert = require("chai").assert;
const chai = require("chai");
const expect = require('chai').expect;
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

    before(async function () {
        // antes de cada test insertamos al usuario que existe para poder ejecutarlos siempre
        usuario_existe = {
            username: "MethodsTestDAOSI",
            email: "methodstestDAOsi@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario_existe).then(value => {
            expect(value).eq(true);
        });
        
        // antes de cada test insertamos y borramos al usuario que no existe para poder ejecutarlos siempre
        usuario_no_existe = {
            username: "MethodsTestDAONO",
            email: "methodstestDAOno@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario_no_existe).then(value => {
            expect(value).eq(true);
        });
        await dao_test.get_id_user(usuario_no_existe.email)
            .then(value => {
                if (value) dao_test.delete_user(value);
            });
    });

    describe("Existe usuario", function () {

        it("Ya existe un usuario con ese nombre", async function () {
            // para que sean los mismos atributos
            let usuario = {
                nombre: usuario_existe.username,
                correo: usuario_existe.email,
                pass: usuario_existe.password
            };
            await task.existeUsuario(usuario).then(value => {
                assert.equal(value, true);
            });
        });

        it("Ya existe un usuario con ese correo", async function () {
            // para que sean los mismos atributos
            let usuario = {
                nombre: usuario_existe.username,
                correo: usuario_existe.email,
                pass: usuario_existe.password
            };
            await task.existeCorreo(usuario).then(value => {
                assert.equal(value, true);
            });
        });

    });

    describe("No existe usuario", function () {

        it("No existe un usuario con ese nombre", async function () {
            // para que sean los mismos atributos
            let usuario = {
                nombre: usuario_no_existe.username,
                correo: usuario_no_existe.email,
                pass: usuario_no_existe.password
            };
            await task.existeUsuario(usuario).then(value => {
                assert.equal(value, false);
            });
        });

        it("No existe un usuario con ese correo", async function () {
            // para que sean los mismos atributos
            let usuario = {
                nombre: usuario_no_existe.username,
                correo: usuario_no_existe.email,
                pass: usuario_no_existe.password
            };
            await task.existeCorreo(usuario).then(value => {
                assert.equal(value, false);
            });
        });

    });

    after(async function () {
        // después de cada test borramos al usuario que se ha insertado poder ejecutarlos siempre
            await dao_test.get_id_user(usuario_existe.email)
            .then(value => {
                if (value) dao_test.delete_user(value);
            });
    });

});