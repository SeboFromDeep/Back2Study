const assert = require("chai").assert;
const chai = require("chai");
const controller = require("../../controller/userController");
const dao = require("../../js/userDAO");
const mysql = require('mysql');
const config = require('../../js/config');
const sinon = require('sinon');
const task = new controller();
const pool = mysql.createPool(config.databaseConfig);
const dao_aux = new dao(pool);


describe('hooks', function () {

    after(function () {
        dao_aux.delete_user("paco@gmail.com", function (error, result) { });
    });

    // tests
    describe("Registrarse correcto", async function () {

        it("Todos los datos del registro son correctos y el usuario no está registrado aún", function (done) {
            let request = {
                body: {
                    username: "paco",
                    correo: "paco@gmail.com",
                    password: "pacopass",
                }
            };

            // mock para que no llame a render
            var mock = sinon.mock(task);
            var expectation_1 = mock.expects("response.render");
            expectation_1.exactly(1);
            var expectation_2 = mock.expects("response.status");
            expectation_2.atMost(1);
            task.registroUsu(request, function (errors, result) {
                assert.equal(errors, null);
                assert.notEqual(result, null);
                done();
            });
            mock.verify();

            done();
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

            // mock para que no llame a render
            var mock = sinon.mock(task);
            var expectation_1 = mock.expects("response.render");
            expectation_1.exactly(1);
            var expectation_2 = mock.expects("response.status");
            expectation_2.atMost(1);
            task.registroUsu(request, function (errors, result) {
                assert.equal(errors, null);
                assert.equal(result, false);
                done();
            });
            mock.verify();

            done();
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

            // mock para que no llame a render
            var mock = sinon.mock(task);
            var expectation_1 = mock.expects("response.render");
            expectation_1.exactly(1);
            var expectation_2 = mock.expects("response.status");
            expectation_2.atMost(1);
            task.registroUsu(request, function (errors, result) {
                assert.equal(errors, null);
                assert.equal(result, false);
                done();
            });
            mock.verify();

            done();
        });
    });

});