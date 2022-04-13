//Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const app = require('../../app');

//Controller Dependencies
const controller = require("../../controller/userController");
const mysql = require('mysql');
const config = require('../../js/config');
const UserController = new controller();
const dao = require("../../js/userDAO");
const pool = mysql.createPool(config.databaseConfig);
const dao_aux = new dao(pool);


describe('hooks', function () {

    after(function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        dao_aux.delete_user("paco@gmail.com", function (error, result) { });
    });

     // tests
     describe("Login correcto", async function () {

        it("Todos los datos del login son correctos y el usuario está registrado", function (done) {
            chai.request('http://localhost:3300')
            .post('/usuarios/login_user')
            .send({correo: "userPrueba1@email.com", password: "1234"})
            .end(function (err, response) {
                expect(response).to.have.status(200);
                done();
            })
        });
     });

     describe("Login incorrecto", async function () {

        it("Todos los datos del login son correctos y el usuario no está registrado", function (done) {
            chai.request('http://localhost:3300')
            .post('/usuarios/login_user')
            .send({correo: "hola@email.com", password: "1234"})
            .end(function (err, response) {
                expect(response).to.have.status(500);
                done();
            })
        });
     });

     describe("Login incorrecto", async function () {

        it("Campo email vacio", function (done) {
            chai.request('http://localhost:3300')
            .post('/usuarios/login_user')
            .send({correo: "", password: "1234"})
            .end(function (err, response) {
                expect(response).to.have.status(500);
                done();
            })
        });
     });

     describe("Login incorrecto", async function () {

        it("Campo password vacio", function (done) {
            chai.request('http://localhost:3300')
            .post('/usuarios/login_user')
            .send({correo: "hola@email.com", password: ""})
            .end(function (err, response) {
                expect(response).to.have.status(500);
                done();
            })
        });
     });

     describe("Login incorrecto", async function () {

        it("Ambos campos vacios", function (done) {
            chai.request('http://localhost:3300')
            .post('/usuarios/login_user')
            .send({correo: "", password: ""})
            .end(function (err, response) {
                expect(response).to.have.status(500);
                done();
            })
        });
     });

});