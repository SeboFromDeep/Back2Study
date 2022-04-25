// Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const moment = require("moment");
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
let agent = chai.request.agent(url);

const ini = moment("2022-05-10");
const fin = moment("2022-05-30");

// tests
describe('hooks', function () {

    let usuario_reg;
    let id_usuario_reg;
    let tareaManual, tareaProgramada;

    before(async function () {
        // antes de cada test insertamos ("registramos") un usuario para que pueda logearse
        usuario_reg = {
            username: "BorrarTareaTestNEG",
            email: "borrartareatestNEG@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario_reg).then(value => {
            expect(value).eq(true);
        });
        await dao_test.get_id_user(usuario_reg.email)
            .then(value => {
                if (value) {
                    id_usuario_reg = value;

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
                }
            });

        await dao_test.insert_task(tareaManual).then(value => {
            expect(value).eq(true);
        });
        await dao_test.get_id_task(tareaManual)
            .then(value => {
                if (value) {
                    tareaManual.id_tarea = value;
                    dao_test.insert_task_m(tareaManual);
                }
            });

        await dao_test.insert_task(tareaProgramada).then(value => {
            expect(value).eq(true);
        });
        await dao_test.get_id_task(tareaProgramada)
            .then(value => {
                if (value) {
                    tareaProgramada.id_programada = value;
                    dao_test.insert_task_p(tareaProgramada);
                }
            });
    })

    describe("Borrar tarea", function () {

        it("Borrar tarea manual", async function () {
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: usuario_reg.password })
                .then((res) => {
                    this.timeout(30000);
                    agent.get('/tareas/deleteTask/' + id_usuario_reg + '/' + tareaManual.id_tarea)
                        .then((res) => {
                            expect(res).to.have.status(200);
                        });
                });
        });

        it("Borrar tarea programada", async function () {
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: usuario_reg.password })
                .then((res) => {
                    this.timeout(30000);
                    agent.get('/tareas/deleteTask/' + id_usuario_reg + '/' + tareaProgramada.id_programada)
                        .then((res) => {
                            expect(res).to.have.status(200);
                        });
                });
        });

    });

    after(async function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        await dao_test.delete_user(id_usuario_reg);
    });

});