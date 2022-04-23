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

    let usuario_reg, usuario_no_reg;

    before(async function () {
        // antes de cada test insertamos ("registramos") un usuario para que pueda logearse
        usuario_reg = {
            username: "LoginTestDAOReg",
            email: "logintestDAOreg@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario_reg);

        // antes de cada test insertamos y borramos al usuario que no está registrado para poder ejecutarlos siempre
        usuario_no_reg = {
            username: "LoginTestDAONoReg",
            email: "logintestDAOnoreg@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario_no_reg).then(value => {
            expect(value).eq(true);
        });
        await dao_test.get_id_user(usuario_no_reg.email)
            .then(value => {
                if (value) dao_test.delete_user(value);
            });
    });

    describe("Iniciar sesión correcto", function () {

        it("Correo y contraseña correctos", async function () {
            await task.login(usuario_reg.email, usuario_reg.password).then(value => {
                console.log("EL VALUE: ");
                console.log(value.email);
                console.log("EL USUARIO REG: ");
                console.log(usuario_reg.email);
                assert.equal(value.email, usuario_reg.emai);
                assert.equal(value.password, usuario_reg.password);
            });
        });

    });

    describe("Iniciar sesión incorrecto", function () {

        it("Correo no registrado en la BD", async function () {
            await task.login(usuario_no_reg.email, usuario_no_reg.password).then(value => {
                assert.equal(value, false);
            });
        });

        it("Correo registrado pero contraseña incorrecta", async function () {
            let wrong_pass = "4321";
            await task.login(usuario_reg.email, wrong_pass).then(value => {
                assert.equal(value, false);
            });
        });

    });

    after(async function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        await dao_test.get_id_user(usuario_reg.email)
            .then(value => {
                if (value) dao_test.delete_user(value);
            });
    });

});