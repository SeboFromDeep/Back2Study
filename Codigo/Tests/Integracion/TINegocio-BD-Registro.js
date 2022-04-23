// Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const app = require('../../app');

// Controller Dependencies
const mysql = require('mysql');
const config = require('../../js/config');
const testDAO = require("../testsDAOMethods");
const pool = mysql.createPool(config.databaseConfig);
const dao_test = new testDAO(pool);


// tests
describe('hooks', function () {

    after(function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        dao_test.get_id_user("registrotestNEG@gmail.com", cb_getID);
        function cb_getID(err, getID) {
            let id_usuario = getID;
            dao_test.delete_user(id_usuario);
        }
    });

    // tests
    describe("Registrarse correcto", async function () {

        it("Todos los datos del registro son correctos y el usuario no está registrado aún", function (done) {
            chai.request('http://localhost:3300')
                .post('/usuarios/registro_Usuario')
                .send({ username: "RegistroTestNEG", correo: "registrotestNEG@gmail.com", password: "1234", password2: "1234" })
                .end(function (err, response) {
                    expect(response).to.have.status(200);
                    done();
                })
        });

    });

    describe("Registrarse incorrecto", async function () {

        it("Ya hay un usuario registrado con el mismo nombre de usuario", function (done) {
            chai.request('http://localhost:3300')
                .post('/usuarios/registro_Usuario')
                .send({ username: "RegistroTestNEG", correo: "registrotestNEGmn@gmail.com", password: "1234", password2: "1234" })
                .end(function (err, response) {
                    expect(response).to.have.status(500);
                    done();
                })
        });

    });

    describe("Registrarse incorrecto", async function () {

        it("Ya hay un usuario registrado con el mismo correo", function (done) {
            chai.request('http://localhost:3300')
                .post('/usuarios/registro_Usuario')
                .send({ username: "RegistroTestNEGmc", correo: "registrotestNEG@gmail.com", password: "1234", password2: "1234" })
                .end(function (err, response) {
                    expect(response).to.have.status(500);
                    done();
                })
        });

    });

    describe("Registrarse incorrecto", function () {

        it("Nombre de usuario vacío", function () {
            chai.request('http://localhost:3300')
                .post('/usuarios/registro_Usuario')
                .send({ username: "", correo: "registrotestNEGnv@gmail.com", password: "1234", password2: "1234" })
                .end(function (err, response) {
                    expect(response).to.have.status(500);
                })
        });

    });

    describe("Registrarse incorrecto", function () {

        it("Correo vacío", function () {
            chai.request('http://localhost:3300')
                .post('/usuarios/registro_Usuario')
                .send({ username: "RegistroTestNEGcv", correo: "", password: "1234", password2: "1234" })
                .end(function (err, response) {
                    expect(response).to.have.status(500);
                })
        });

    });

    describe("Registrarse incorrecto", function () {

        it("Contraseña menor de 4 caracteres", function () {
            chai.request('http://localhost:3300')
                .post('/usuarios/registro_Usuario')
                .send({ username: "RegistroTestNEGm4", correo: "registrotestNEGm4@gmail.com", password: "123", password2: "123" })
                .end(function (err, response) {
                    expect(response).to.have.status(500);
                })
        });

    });

    describe("Registrarse incorrecto", function () {

        it("Contraseñas distintas", function () {
            chai.request('http://localhost:3300')
                .post('/usuarios/registro_Usuario')
                .send({ username: "RegistroTestNEGcd", correo: "registrotestNEGcd@gmail.com", password: "1234", password2: "4321" })
                .end(function (err, response) {
                    expect(response).to.have.status(500);
                })
        });

    });

});