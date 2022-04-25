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
const url = 'http://localhost:3300';
let agent = chai.request.agent(url);

// tests
describe('hooks', function () {

    describe("Registrarse correcto", function () {

        it("Todos los datos del registro son correctos y el usuario no está registrado aún", async function () {
            await agent.post('/usuarios/registro_Usuario')
                .send({ username: "RegistroTestNEG", correo: "registrotestNEG@gmail.com", password: "1234", password2: "1234" })
                .then((res) => {
                    expect(res).to.have.status(200);
                })
        });

    });

    describe("Registrarse incorrecto", function () {

        it("Ya hay un usuario registrado con el mismo nombre de usuario", async function () {
            await agent.post('/usuarios/registro_Usuario')
                .send({ username: "RegistroTestNEG", correo: "registrotestNEGmn@gmail.com", password: "1234", password2: "1234" })
                .then((res) => {
                    expect(res).to.have.status(500);
                })
        });

    });

    describe("Registrarse incorrecto", function () {

        it("Ya hay un usuario registrado con el mismo correo", async function () {
            await agent.post('/usuarios/registro_Usuario')
                .send({ username: "RegistroTestNEGmc", correo: "registrotestNEG@gmail.com", password: "1234", password2: "1234" })
                .then((res) => {
                    expect(res).to.have.status(500);
                })
        });

    });

    describe("Registrarse incorrecto", function () {

        it("Nombre de usuario vacío", async function () {
            await agent.post('/usuarios/registro_Usuario')
                .send({ username: "", correo: "registrotestNEGnv@gmail.com", password: "1234", password2: "1234" })
                .then((res) => {
                    expect(res).to.have.status(500);
                })
        });

    });

    describe("Registrarse incorrecto", function () {

        it("Correo vacío", async function () {
            await agent.post('/usuarios/registro_Usuario')
                .send({ username: "RegistroTestNEGcv", correo: "", password: "1234", password2: "1234" })
                .then((res) => {
                    expect(res).to.have.status(500);
                })
        });

    });

    describe("Registrarse incorrecto", function () {

        it("Contraseña menor de 4 caracteres", async function () {
            await agent.post('/usuarios/registro_Usuario')
                .send({ username: "RegistroTestNEGm4", correo: "registrotestNEGm4@gmail.com", password: "123", password2: "123" })
                .then((res) => {
                    expect(res).to.have.status(500);
                })
        });

    });

    describe("Registrarse incorrecto", function () {

        it("Contraseñas distintas", async function () {
            await agent.post('/usuarios/registro_Usuario')
                .send({ username: "RegistroTestNEGcd", correo: "registrotestNEGcd@gmail.com", password: "1234", password2: "4321" })
                .then((res) => {
                    expect(res).to.have.status(500);
                })
        });

    });

    after(async function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        await dao_test.get_id_user("registrotestNEG@gmail.com")
            .then(value => {
                if (value) dao_test.delete_user(value);
            });
    });

});