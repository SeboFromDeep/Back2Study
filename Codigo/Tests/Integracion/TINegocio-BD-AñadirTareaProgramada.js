// Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const app = require('../../app');
const url = 'http://localhost:3300';

// Controller Dependencies
const mysql = require('mysql');
const config = require('../../js/config');
const testDAO = require("../testsDAOMethods");
const { getMaxListeners } = require("../../app");
const pool = mysql.createPool(config.databaseConfig);
const dao_test = new testDAO(pool);

// tests
describe('hooks', function () {

    let usuario_reg;

    before(function () {
        // antes de cada test insertamos ("registramos") un usuario para que pueda logearse
        usuario_reg = {
            username: "AñadirTareaTestNEG",
            email: "añadirtareatestNEG@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_reg);
    })

    after(function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        dao_test.get_id_user("añadirtareatestNEG@gmail.com", cb_getID);
        function cb_getID(err, getID) {
            id_usuario_reg = getID;
            dao_aux.delete_user(id_usuario_reg);
        }

    });

    describe("Añadir tarea programada correcta", function () {

        it("Todos los datos correctos", function () {
            let agent = chai.request.agent(url);
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: usuario_reg.password })
                .then((res) => {
                    expect(res).to.have.status(200);
                    agent.post('/tareas/add_scheduled_task')
                        .send({ nombre: "NombrePNEGsi", prioridad: "BAJA", tipo: "DIARIA", categoria: "@CategoriaPNEGsi", horas: "1", fechaIni: "12/04/2022", fechaFin: "13/04/2022" })
                        .redirects(0)
                        .end((err, res, body) => {
                            expect(res).to.have.status(302);
                        });
                });
        });

    });

    describe("Añadir tarea programada incorrecta", function () {

        it("Campos vacíos", function () {
            let agent = chai.request.agent(url);
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: usuario_reg.password })
                .then((res) => {
                    expect(res).to.have.status(200);
                    agent.post('/tareas/add_scheduled_task')
                        .send({ nombre: "NombrePNEGno", prioridad: "", tipo: "SEMANAL", categoria: "@CategoriaPNEGno", horas: "1", fechaIni: "", fechaFin: "" })
                        .redirects(0)
                        .end((err, res, body) => {
                            expect(res).to.have.status(302);
                        });
                });
        });

        it("Tarea de 0 horas y fechas ini/fin incoherentes", function () {

            let agent = chai.request.agent(url);
            await agent.post('/usuarios/login_user')
                .send({ correo: 'prueba@gmail.com', password: '1234' })
                .then((res) => {
                    expect(res).to.have.status(200);
                    agent.post('/tareas/add_scheduled_task')
                        .send({ nombre: "NombrePNEGno", prioridad: "MEDIA", tipo: "SEMANAL", categoria: "@CategoriaPNEGno", horas: "0", fechaIni: "11/04/2022", fechaFin: "10/04/2022" })
                        .redirects(0)
                        .end((err, res, body) => {
                            expect(res).to.have.status(302);
                        });
                });
        });

    });

});