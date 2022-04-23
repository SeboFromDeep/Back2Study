// Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const app = require('../../app');

// Controller Dependencies
const testDAO = require("../testsDAOMethods");
const mysql = require('mysql');
const config = require('../../js/config');
const pool = mysql.createPool(config.databaseConfig);
const dao_test = new testDAO(pool);
const url = 'http://localhost:3300';
let agent = chai.request.agent(url);

// tests
describe('hooks', function () {

    let usuario_reg, usuario_no_reg;

    before(async function () {
        // antes de cada test insertamos ("registramos") un usuario para que pueda logearse
        usuario_reg = {
            username: "LoginTestNEGReg",
            email: "logintestNEGreg@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario_reg).then(value => {
            expect(value).eq(true);
        });

        // antes de cada test insertamos y borramos un usuario para asegurarnos que no está registrado
        usuario_no_reg = {
            username: "LoginTestNEGNoReg",
            email: "logintestNEGnoreg@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario_no_reg).then(value => {
            expect(value).eq(true);
        });
        await dao_test.get_id_user(usuario_no_reg.email)
            .then(value => {
                if (value) dao_test.delete_user(value);
            });
    })

    describe("Login correcto", function () {

        it("Todos los datos del login son correctos y el usuario está registrado", async function () {
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: usuario_reg.password })
                .then((res) => {
                    expect(res).to.have.status(200);
                })
        });

    });

    describe("Login incorrecto", function () {

        it("Todos los datos del login son correctos y el usuario no está registrado", async function () {
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_no_reg.email, password: usuario_no_reg.password })
                .then((res) => {
                    expect(res).to.have.status(500);
                })
        });

        it("Campo email vacio", async function () {
            await agent.post('/usuarios/login_user')
                .send({ correo: "", password: "1234" })
                .then((res) => {
                    expect(res).to.have.status(500);
                })
        });

        it("Campo contraseña vacío", async function () {
            await agent
                .post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: "" })
                .then((res) => {
                    expect(res).to.have.status(500);
                })
        });

        it("Contraseña incorrecta", async function () {
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: "4321" })
                .then((res) => {
                    expect(res).to.have.status(500);
                })
        });

        it("Ambos campos vacios", async function () {
            await agent.post('/usuarios/login_user')
                .send({ correo: "", password: "" })
                .then((res) => {
                    expect(res).to.have.status(500);
                })
        });

    });

    after(async function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        await dao_test.get_id_user(usuario_reg.email)
            .then(value => {
                if (value) dao_test.delete_user(value);
            });
    })

});