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

    describe("Registrarse", function () {

        it("Agrega usuario a la BD", async function () {
            let nuevoUsuario = {
                nombre: "RegistroTestDAO",
                correo: "registrotestDAO@gmail.com",
                pass: "1234",
            };
            await task.registro(nuevoUsuario).then(value => {
                assert.notEqual(value, false);
            });

        });

    });

    after(async function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        await dao_test.get_id_user("registrotestDAO@gmail.com")
            .then(value => {
                if (value) dao_test.delete_user(value);
            });
    });

});