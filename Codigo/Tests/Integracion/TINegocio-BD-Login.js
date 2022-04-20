// Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const app = require('../../app');

// Controller Dependencies
const controller = require("../../controller/userController");
const testDAO = require("../testsDAOMethods");
const mysql = require('mysql');
const config = require('../../js/config');
const UserController = new controller();
const dao_test = new testDAO(pool);


// tests
describe('hooks', function () {

    before(function () {
        // antes de cada test insertamos ("registramos") un usuario para que pueda logearse
        let usuario_reg = {
            username: "LoginTestNEGReg",
            email: "logintestNEGreg@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_reg);
        // antes de cada test insertamos y borramos al usuario que no está registrado para poder ejecutarlos siempre
        let usuario_no_reg = {
            username: "LoginTestNEGNoReg",
            email: "logintestNEGnoreg@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_no_reg);
        let id_usuario_no_reg = dao_test.get_id_user(usuario_no_reg.email)
        dao_test.delete_user(id_usuario_no_reg);
    })

    after(function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        let id_usuario_reg = dao_test.get_id_user("logintestNEGreg@gmail.com");
        dao_aux.delete_user(id_usuario_reg);
    });

    describe("Login correcto", function () {

        it("Todos los datos del login son correctos y el usuario está registrado", function () {
            chai.request('http://localhost:3300')
                .post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: usuario_reg.password })
                .end(function (err, response) {
                    expect(response).to.have.status(200);
                })
        });
    });

    describe("Login incorrecto", function () {

        it("Todos los datos del login son correctos y el usuario no está registrado", function () {
            chai.request('http://localhost:3300')
                .post('/usuarios/login_user')
                .send({ correo: usuario_no_reg.email, password: usuario_no_reg.password })
                .end(function (err, response) {
                    expect(response).to.have.status(500);
                })
        });

        it("Campo email vacio", function () {
            chai.request('http://localhost:3300')
                .post('/usuarios/login_user')
                .send({ correo: "", password: "1234" })
                .end(function (err, response) {
                    expect(response).to.have.status(500);
                })
        });

        it("Campo contraseña vacío", function () {
            chai.request('http://localhost:3300')
                .post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: "" })
                .end(function (err, response) {
                    expect(response).to.have.status(500);
                })
        });

        it("Contraseña incorrecta", function () {
            chai.request('http://localhost:3300')
                .post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: "4321" })
                .end(function (err, response) {
                    expect(response).to.have.status(500);
                })
        });

        it("Ambos campos vacios", function () {
            chai.request('http://localhost:3300')
                .post('/usuarios/login_user')
                .send({ correo: "", password: "" })
                .end(function (err, response) {
                    expect(response).to.have.status(500);
                })
        });

    });

});