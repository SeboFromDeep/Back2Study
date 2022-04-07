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
    describe("Registrarse correcto", async function () {

        it("Todos los datos del registro son correctos y el usuario no está registrado aún", function (done) {
            let nuevoUsuario = {
                nombre: "paco",
                correo: "paco@gmail.com",
                pass: "pacopass",
            };
            task.registro(nuevoUsuario, function (errors, result) {
                assert.equal(errors, null);
                assert.notEqual(result, null);
                done();
            });
        });

    });

    describe("Registrarse incorrecto", async function () {

        it("Ya hay un usuario registrado con el mismo nombre de usuario", function (done) {
            let nuevoUsuario = {
                nombre: "paco",
                correo: "lucia@gmail.com",
                pass: "luciapass",
            };
            task.registro(nuevoUsuario, function (errors, result) {
                assert.equal(errors, null);
                assert.equal(result, false);
                done();
            });
        });

    });

    describe("Registrarse incorrecto", async function () {

        it("Ya hay un usuario registrado con el mismo correo", function (done) {
            let nuevoUsuario = {
                nombre: "maria",
                correo: "paco@gmail.com",
                pass: "mariapass",
            };
            task.registro(nuevoUsuario, function (errors, result) {
                assert.equal(errors, null);
                assert.equal(result, false);
                done();
            });
        });

    });

});