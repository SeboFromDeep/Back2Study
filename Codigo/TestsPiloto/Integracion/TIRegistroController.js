const assert = require("chai").assert;
const chai = require("chai");
const controller = require("../../controller/userController");
const dao = require("../../js/userDAO");
const mysql = require('mysql');
const config = require('../../js/config');
const task = new controller();
const pool = mysql.createPool(config.databaseConfig);
const dao_aux = new dao(pool);

describe('hooks', function () {

    after(function () {
        // runs after each test in this block
        dao_aux.delete_user("paco@gmail.com", function (error, result) { });
    });

    // test cases
    describe("Registrarse correcto", async function () {

        it("Todos los datos del registro son correctos y el usuario no está registrado aún", function (done) {
            let request = {
                body: {
                    username: "paco",
                    correo: "paco@gmail.com",
                    password: "pacopass",
                }
            };
            task.registroUsu(request, function (errors, result) {
                assert.equal(errors, null);
                assert.notEqual(result, null);
                done();
            });
        });

    });

    describe("Registrarse incorrecto", async function () {

        it("Ya hay un usuario registrado con el mismo nombre de usuario", function (done) {
            let request = {
                body: {
                    username: "paco",
                    correo: "lucia@gmail.com",
                    password: "luciapass",
                }
            };
            task.registroUsu(request, function (errors, result) {
                assert.equal(errors, null);
                assert.equal(result, false);
                done();
            });
        });

    });

    describe("Registrarse incorrecto", async function () {

        it("Ya hay un usuario registrado con el mismo correo", function (done) {
            let request = {
                body: {
                    username: "maria",
                    correo: "paco@gmail.com",
                    password: "mariapass",
                }
            };
            task.registroUsu(request, function (errors, result) {
                assert.equal(errors, null);
                assert.equal(result, false);
                done();
            });
        });

    });

});