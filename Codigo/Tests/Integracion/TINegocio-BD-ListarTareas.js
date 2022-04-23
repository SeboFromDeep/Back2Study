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
const { getMaxListeners } = require("../../app");
const pool = mysql.createPool(config.databaseConfig);
const dao_test = new testDAO(pool);

const ini = moment("2022-05-10");
const fin = moment("2022-05-30");

// tests
describe('hooks', function () {

    let usuario_sin_tareas, usuario_con_tareas, usuario_con_tareas_m, usuario_con_tareas_p;
    let id_usuario_sin_tareas, id_usuario_con_tareas_m, id_usuario_con_tareas_p, id_usuario_con_tareas;

    before(function () {
        // antes de cada test insertamos ("registramos") un usuario que no tenga tareas
        usuario_sin_tareas = {
            username: "ListaTareasTestNEGSIN",
            email: "listatareastestNEGsin@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_sin_tareas);
        setTimeout(function () {
            dao_test.get_id_user(usuario_sin_tareas.email, cb_getID);
            function cb_getID(err, getID) {
                id_usuario_sin_tareas = getID;
            }
        }, 1000);
        
        // antes de cada test insertamos ("registramos") un usuario que tenga tareas manuales
        usuario_con_tareas_m = {
            username: "ListaTareasTestNEGCONM",
            email: "listatareastestNEGconm@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_con_tareas_m);
        setTimeout(function () {
            dao_test.get_id_user(usuario_cousuario_con_tareas_m_tareas.email, cb_getID);
            function cb_getID(err, getID) {
                id_usuario_con_tareas_m = getID;
            }
        }, 1000);

        // añadimos tareas a ese usuario
        let tarea1m = {
            nombre: "Nombre1MNEG",
            prioridad: "BAJA",
            categoria: "@Categoria1MNEG",
            id_usuario: id_usuario_con_tareas_m,
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
        dao_test.insert_task(tarea1m);
        setTimeout(function () {
            dao_test.get_id_task(tarea1m, cb_getID);
            function cb_getID(err, getID) {
                tarea1m.id_tarea = getID;
                dao_test.insert_task_m(tarea1m);
            }
        }, 1000);

        let tarea2m = {
            nombre: "Nombre2MNEG",
            prioridad: "MEDIA",
            categoria: "@Categoria2MNEG",
            id_usuario: id_usuario_con_tareas,
            fechafin: fin.format("YYYY-MM-DD"),
            fechaini: ini.format("YYYY-MM-DD"),
            tipo: "m",
            // atributos tarea manual
            id_tarea: -1,
            hora_ini: "12:00",
            hora_fin: "17:00",
            recurrente: 1,
            dias_recurrentes: "@M@X"
        };
        dao_test.insert_task(tarea2m);
        setTimeout(function () {
            dao_test.get_id_task(tarea2m, cb_getID);
            function cb_getID(err, getID) {
                tarea2m.id_tarea = getID;
                dao_test.insert_task_m(tarea2m);
            }
        }, 1000);

        // antes de cada test insertamos ("registramos") un usuario que tenga tareas programadas
        usuario_con_tareas_p = {
            username: "ListaTareasTestNEGCONP",
            email: "listatareastestNEGconp@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_con_tareas_p);
        setTimeout(function () {
            dao_test.get_id_user(usuario_con_tareas_p.email, cb_getID);
            function cb_getID(err, getID) {
                id_usuario_con_tareas_p = getID;
            }
        }, 1000);

        // añadimos tareas a ese usuario
        let tarea1p = {
            nombre: "Nombre1PNEG",
            prioridad: "ALTA",
            categoria: "@Categoria1PNEG",
            id_usuario: id_usuario_con_tareas,
            fechafin: fin.format("YYYY-MM-DD"),
            fechaini: ini.format("YYYY-MM-DD"),
            tipo: "p",
            // atributos tarea programada
            horas: 10,
            id_programada: -1,
            tipo_ds: "DIARIA"
        };
        dao_test.insert_task(tarea1p);
        setTimeout(function () {
            dao_test.get_id_task(tarea1p, cb_getID);
            function cb_getID(err, getID) {
                tarea1p.id_programada = getID;
                dao_test.insert_task_p(tarea1p);
            }
        }, 1000);

        let tarea2p = {
            nombre: "Nombre2PNEG",
            prioridad: "BAJA",
            categoria: "@Categoria2PNEG",
            id_usuario: id_usuario_con_tareas,
            fechafin: fin.format("YYYY-MM-DD"),
            fechaini: ini.format("YYYY-MM-DD"),
            tipo: "p",
            // atributos tarea programada
            horas: 20,
            id_programada: -1,
            tipo_ds: "SEMANAL"
        };
        dao_test.insert_task(tarea2p);
        setTimeout(function () {
            dao_test.get_id_task(tarea2p, cb_getID);
            function cb_getID(err, getID) {
                tarea2p.id_programada = getID;
                dao_test.insert_task_p(tarea2p);
            }
        }, 1000);

        // antes de cada test insertamos ("registramos") un usuario que tenga tareas de ambos tipos
        usuario_con_tareas = {
            username: "ListaTareasTestNEGCON",
            email: "listatareastestNEGcon@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_con_tareas);
        setTimeout(function () {
            dao_test.get_id_user(id_usuario_con_tareas.email, cb_getID);
            function cb_getID(err, getID) {
                id_usuario_con_tareas = getID;
            }
        }, 1000);

        // añadimos tareas a ese usuario
        let tarea3m = {
            nombre: "Nombre3MNEG",
            prioridad: "ALTA",
            categoria: "@Categoria3MNEG",
            id_usuario: id_usuario_con_tareas_m,
            fechafin: fin.format("YYYY-MM-DD"),
            fechaini: ini.format("YYYY-MM-DD"),
            tipo: "m",
            // atributos tarea manual
            id_tarea: -1,
            hora_ini: "14:00",
            hora_fin: "19:00",
            recurrente: 0,
            dias_recurrentes: "@J"
        };
        dao_test.insert_task(tarea3m);
        setTimeout(function () {
            dao_test.get_id_task(tarea3m, cb_getID);
            function cb_getID(err, getID) {
                tarea3m.id_tarea = getID;
                dao_test.insert_task_m(tarea3m);
            }
        }, 1000);

        let tarea3p = {
            nombre: "Nombre3PNEG",
            prioridad: "MEDIA",
            categoria: "@Categoria3PNEG",
            id_usuario: id_usuario_con_tareas,
            fechafin: fin.format("YYYY-MM-DD"),
            fechaini: ini.format("YYYY-MM-DD"),
            tipo: "p",
            // atributos tarea programada
            horas: 12,
            id_programada: -1,
            tipo_ds: "DIARIA"
        };
        dao_test.insert_task(tarea3p);
        setTimeout(function () {
            dao_test.get_id_task(tarea3p, cb_getID);
            function cb_getID(err, getID) {
                tarea3p.id_programada = getID;
                dao_test.insert_task_p(tarea3p);
            }
        }, 1000);
        
    });

    after(function () {
        // después de cada test borramos a los usuarios que se han insertado para poder ejecutarlos siempre
        dao_test.delete_user(id_usuario_sin_tareas);
        dao_test.delete_user(id_usuario_con_tareas_m);
        dao_test.delete_user(id_usuario_con_tareas_p);
        dao_test.delete_user(id_usuario_con_tareas);
    });

    describe("Listar tareas", function () {

        it("El usuario no tiene ninguna tarea", function () {
            let agent = chai.request.agent('http://localhost:3300');
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_sin_tareas.email, password: usuario_sin_tareas.password })
                .then((res) => {
                    this.timeout(30000);
                    agent.get('/tareas/taskList')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                        });
                });
        });

        it("El usuario sólo tiene tareas manuales", async function () {
            let agent = chai.request.agent('http://localhost:3300');
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_con_tareas_m.email, password: usuario_con_tareas_m.password })
                .then((res) => {
                    this.timeout(30000);
                    agent.get('/tareas/taskList')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                        });
                });
        })

        it("El usuario sólo tiene tareas programadas", async function () {
            let agent = chai.request.agent('http://localhost:3300');
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_con_tareas_p.email, password: usuario_con_tareas_p.password })
                .then((res) => {
                    this.timeout(30000);
                    agent.get('/tareas/taskList')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                        });
                });
        })

        it("El usuario tiene tareas manuales y programadas", async function () {
            let agent = chai.request.agent('http://localhost:3300');
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_con_tareas.email, password: usuario_con_tareas.password })
                .then((res) => {
                    this.timeout(30000);
                    agent.get('/tareas/taskList')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                        });
                });
        })

    });

});