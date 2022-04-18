// Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const app = require('../../app');

// tests
describe("Listar sin pruebas", async function () {

    it("El usuario no tiene ninguna tarea", async function () {

        let agent = chai.request.agent('http://localhost:3300');
        await agent.post('/usuarios/login_user')
            .send({ correo: 'userPrueba3@email.com', password: '1234' })
            .then((res) => {
                this.timeout(30000);
                agent.get('/tareas/taskList')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                    });
            });
    });

});

describe("Lista con solo tareas manuales ", async function () {

    it("El usuario solo tiene tareas manuales", async function () {

        let agent = chai.request.agent('http://localhost:3300');
        await agent.post('/usuarios/login_user')
            .send({ correo: 'userPrueba6@email.com', password: '1234' })
            .then((res) => {
                this.timeout(30000);
                agent.get('/tareas/taskList')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                    });
            });
    })

});

describe("Lista con solo tareas programadas ", async function () {

    it("El usuario solo tiene tareas programadas", async function () {

        let agent = chai.request.agent('http://localhost:3300');
        await agent.post('/usuarios/login_user')
            .send({ correo: 'userPrueba2@email.com', password: '1234' })
            .then((res) => {
                this.timeout(30000);
                agent.get('/tareas/taskList')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                    });
            });
    })

});


describe("Lista con ambos tipos de tareas", async function () {

    it("El usuario tiene tareas manuales y programadas", async function () {

        let agent = chai.request.agent('http://localhost:3300');
        await agent.post('/usuarios/login_user')
            .send({ correo: 'userPrueba1@email.com', password: '1234' })
            .then((res) => {
                this.timeout(30000);
                agent.get('/tareas/taskList')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                    });
            });
    })

});