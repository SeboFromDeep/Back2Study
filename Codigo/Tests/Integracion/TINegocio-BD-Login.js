// Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const app = require('../../app');

// Controller Dependencies
const controller = require("../../controller/userController");
const mysql = require('mysql');
const config = require('../../js/config');
const UserController = new controller();


// tests
describe("Login correcto", function () {

    it("Todos los datos del login son correctos y el usuario está registrado", function () {
        chai.request('http://localhost:3300')
            .post('/usuarios/login_user')
            .send({ correo: "userPrueba1@email.com", password: "1234" })
            .end(function (err, response) {
                expect(response).to.have.status(200);
            })
    });
});

describe("Login incorrecto", function () {

    it("Todos los datos del login son correctos y el usuario no está registrado", function () {
        chai.request('http://localhost:3300')
            .post('/usuarios/login_user')
            .send({ correo: "hola@email.com", password: "1234" })
            .end(function (err, response) {
                expect(response).to.have.status(500);
            })
    });
});

describe("Login incorrecto", function () {

    it("Campo email vacio", function () {
        chai.request('http://localhost:3300')
            .post('/usuarios/login_user')
            .send({ correo: "", password: "1234" })
            .end(function (err, response) {
                expect(response).to.have.status(500);
            })
    });
});

describe("Login incorrecto", function () {

    it("Campo password vacio", function () {
        chai.request('http://localhost:3300')
            .post('/usuarios/login_user')
            .send({ correo: "hola@email.com", password: "" })
            .end(function (err, response) {
                expect(response).to.have.status(500);
            })
    });
});

describe("Login incorrecto", function () {

    it("Ambos campos vacios", function () {
        chai.request('http://localhost:3300')
            .post('/usuarios/login_user')
            .send({ correo: "", password: "" })
            .end(function (err, response) {
                expect(response).to.have.status(500);
            })
    });
});