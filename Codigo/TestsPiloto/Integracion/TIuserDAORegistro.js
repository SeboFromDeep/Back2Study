const assert = require("chai").assert;
const chai = require("chai");
const dao = require("../../js/userDAO");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const pool = mysql.createPool(config.databaseConfig);
const task = new dao(pool);

describe('hooks', function () {

    after(function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        task.delete_user("paco@gmail.com", function (error, result) { });
    });

    // tests
    describe("Registrarse", function () {

        it("Agrega usuario a la BD", function () {
            let nuevoUsuario = {
                nombre: "paco",
                correo: "paco@gmail.com",
                pass: "pacopass",
            };
            task.registro(nuevoUsuario, function (errors, result) {
                assert.equal(errors, null);
                assert.equal(result, true);
            });
        });

    });

});