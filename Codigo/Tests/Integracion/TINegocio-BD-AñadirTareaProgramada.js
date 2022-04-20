// Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const app = require('../../app');
const url='http://localhost:3300';

// Controller Dependencies
const controller = require("../../controller/userController");
const mysql = require('mysql');
const config = require('../../js/config');
const UserController = new controller();
const dao = require("../../js/userDAO");
const { getMaxListeners } = require("../../app");
const pool = mysql.createPool(config.databaseConfig);
const UserDao = new dao(pool);

// tests
describe("Añadir Tarea Programada", function () {
    before(function (){
        it("Todos los datos del registro son correctos y el usuario no está registrado aún", function (done) {
            chai.request('http://localhost:3300')
            .post('/usuarios/registro_Usuario')
            .send({username:"prueba", correo: "prueba@gmail.com", password: "1234", password2: "1234"})
            .end(function (err, response) {
                expect(response).to.have.status(200);
                done();
            })
        });
    });

    it("Tarea Programada correcta", async function () {

        let agent = chai.request.agent(url);
        await agent.post('/usuarios/login_user')
            .send({ correo: 'prueba@gmail.com', password: '1234' })
            .then((res) => {
                    expect(res).to.have.status(200);
                    agent.post('/tareas/add_scheduled_task')
                    .send({ nombre: "prueba", prioridad: "Media", tipo: "Diaria", categoria: "@prueba", horas: "1", fechaIni: "12/04/2022", fechaFin: "13/04/2022" })
                    .redirects(0)
                    .end((err, res, body) => {
                        expect(res).to.have.status(302);
                    });
            });
        });

        it("Tarea Programada incorrecta", async function () {

            let agent = chai.request.agent(url);
            await agent.post('/usuarios/login_user')
            .send({correo:'prueba@gmail.com', password:'1234'})
            .then((res) => {
                    expect(res).to.have.status(200);
                    agent.post('/tareas/add_scheduled_task')
                    .send({nombre:"prueba", prioridad: "", tipo:"Semanal", categoria: "@prueba", horas: "1", fechaIni:"", fechaFin:""})
                    .redirects(0)
                    .end((err, res, body) => {

                        expect(res).to.have.status(302);
                    });
            });
        });

        it("Tarea Programada incorrecta", async function () {

            let agent = chai.request.agent(url);
            await agent.post('/usuarios/login_user')
            .send({correo:'prueba@gmail.com', password:'1234'})
            .then((res) => {
                    expect(res).to.have.status(200);
                    agent.post('/tareas/add_scheduled_task')
                    .send({nombre:"prueba", prioridad: "Media", tipo:"Diaria", categoria: "@prueba", horas: "0", fechaIni:"11/04/2022" , fechaFin:"10/04/2022"})
                    .redirects(0)
                    .end((err, res, body) => {

                        expect(res).to.have.status(302);
                });
        });
    });
});