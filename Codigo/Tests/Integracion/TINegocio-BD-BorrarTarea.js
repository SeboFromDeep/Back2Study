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

const ini = moment("2022-05-10");
const fin = moment("2022-05-30");

// tests
describe('hooks', function () {

    let usuario_reg;
    let id_usuario_reg;
    let tareaManual, tareaProgramada;

    before(function () {
        // antes de cada test insertamos ("registramos") un usuario para que pueda logearse
        usuario_reg = {
            username: "BorrarTareaTestNEG",
            email: "borrartareatestNEG@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_reg);
        setTimeout(function () {
            dao_test.get_id_user(usuario_reg.email, cb_getID);
            function cb_getID(err, getID) {
                id_usuario_reg = getID;
            }
        }, 1000);

        // añadimos tareas a ese usuario, una de cada tipo
        tareaManual = {
            nombre: "NombreMNEG",
            prioridad: "BAJA",
            categoria: "@CategoriaMNEG",
            id_usuario: id_usuario_reg,
            fechafin: fin.format("YYYY-MM-DD"),
            fechaini: ini.format("YYYY-MM-DD"),
            tipo: "m",
            // atributos tarea manual
            id_tarea: -1,
            hora_ini: "10:00",
            hora_fin: "15:00",
            recurrente: 0,
            dias_recurrentes: "@L"
        };
        dao_test.insert_task(tareaManual);
        setTimeout(function () {
            dao_test.get_id_task(tareaManual, cb_getID);
            function cb_getID(err, getID) {
                tareaManual.id_tarea = getID;
                dao_test.insert_task_m(tareaManual);
            }
        }, 1000);

        tareaProgramada = {
            nombre: "NombrePNEG",
            prioridad: "ALTA",
            categoria: "@CategoriaPNEG",
            id_usuario: id_usuario_reg,
            fechafin: fin.format("YYYY-MM-DD"),
            fechaini: ini.format("YYYY-MM-DD"),
            tipo: "p",
            // atributos tarea programada
            horas: 10,
            id_programada: -1,
            tipo_ds: "DIARIA"
        };
        dao_test.insert_task(tareaProgramada);
        setTimeout(function () {
            dao_test.get_id_task(tareaProgramada, cb_getID);
            function cb_getID(err, getID) {
                tareaProgramada.id_programada = getID;
                dao_test.insert_task_m(tareaProgramada);
            }
        }, 1000);
    })

    after(function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        dao_aux.delete_user(id_usuario_reg);
    });

    describe("Borrar tarea", function () {

        it("Borrar tarea manual", async function () {
            let agent = chai.request.agent(url);
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: usuario_reg.password })
                .then((res) => {
                    this.timeout(30000);
                    agent.get('/tareas/deleteTask/' + id_usuario_reg + '/' + tareaManual.id_tarea)
                        .end((err, res, body) => {
                            expect(res).to.have.status(200);
                        });
                });
        });

        it("Borrar tarea programada", async function () {
            let agent = chai.request.agent(url);
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: usuario_reg.password })
                .then((res) => {
                    this.timeout(30000);
                    agent.get('/tareas/deleteTask/' + id_usuario_reg + '/' + tareaProgramada.id_programada)
                        .end((err, res, body) => {
                            expect(res).to.have.status(200);
                        });
                });
        });

    });

});