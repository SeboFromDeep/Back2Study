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

    // tests
    describe("Listar sin pruebas", async function () {

        it("El usuario no tiene ninguna tarea", function (done) {
            chai.request('http://localhost:3300')
            .post('/tareas/taskList')
            .send({userName:"userPrueba3", mail: "userPrueba3@email.com"})
            .end(function (err, response) {
                expect(response).to.have.status(200);
                done();
            })
        });

    });

    describe("Lista con solo tareas manuales ", async function () {

        it("El usuario solo tiene tareas manuales", function (done) {
            let request = {
                session: {
                    userName:"userPrueba6",
                    mail: "userPrueba6@email.com",
                }

            };
            chai.request('http://localhost:3300')
            .post('/tareas/taskList')
            .send({request})
            .end(function (err, response) {
                expect(response).to.have.status(200);
                done();
            })
        });

    });

    describe("Lista con solo tareas programadas ", async function () {

        it("El usuario solo tiene tareas programadas", function (done) {
            chai.request('http://localhost:3300')
            .post('/tareas/taskList')
            .send({userName:"userPrueba2", mail: "userPrueba2@email.com"})
            .end(function (err, response) {
                expect(response).to.have.status(200);
                done();
            })
        });

    });


    describe("Lista con ambos tipos de tareas", async function () {

        it("El usuario tiene tareas de ambos tipos", function (done) {
            chai.request('http://localhost:3300')
            .post('/tareas/taskList')
            .send({userName:"userPrueba1", mail: "userPrueba1@email.com"})
            .end(function (err, response) {
                expect(response).to.have.status(200);
                done();
            })
        });

    });
})