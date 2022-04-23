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

// tests
describe('hooks', function () {

    let id_usuario_sin_tareas, id_usuario_con_tareas_m, id_usuario_con_tareas_p, id_usuario_con_tareas;

    before(function () {
        // antes de cada test insertamos ("registramos") un usuario que no tenga tareas
        let usuario_sin_tareas = {
            username: "ListaTareasTestNEGSIN",
            email: "listatareastestNEGsin@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_sin_tareas);
        id_usuario_sin_tareas = dao_test.get_id_user(usuario_con_tareas.email);
        
        // antes de cada test insertamos ("registramos") un usuario que tenga tareas manuales
        let usuario_con_tareas_m = {
            username: "ListaTareasTestNEGCONM",
            email: "listatareastestNEGconm@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_con_tareas_m);
        id_usuario_con_tareas_m = dao_test.get_id_user(usuario_con_tareas_m.email);

        // añadimos tareas a ese usuario
        let tarea1m = {
            nombre: "Nombre1MNEG",
            prioridad: "BAJA",
            categoria: "@Categoria1MNEG",
            id_usuario: id_usuario_con_tareas_m,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
            tipo: "m",
            // atributos tarea manual
            id_tarea: -1,
            hora_ini: "10:00",
            hora_fin: "15:00",
            recurrente: 0,
            dias_recurrentes: "@L"
        };
        dao_test.insert_task(tarea1m);
        tarea1m.id_tarea = dao_test.get_id_task(tarea1m);
        dao_test.insert_task_m(tarea1m);

        let tarea2m = {
            nombre: "Nombre2MNEG",
            prioridad: "MEDIA",
            categoria: "@Categoria2MNEG",
            id_usuario: id_usuario_con_tareas,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
            tipo: "m",
            // atributos tarea manual
            id_tarea: -1,
            hora_ini: "12:00",
            hora_fin: "17:00",
            recurrente: 1,
            dias_recurrentes: "@M@X"
        };
        dao_test.insert_task(tarea2m);
        tarea2m.id_tarea = dao_test.get_id_task(tarea2m);
        dao_test.insert_task_m(tarea2m);

        // antes de cada test insertamos ("registramos") un usuario que tenga tareas programadas
        let usuario_con_tareas_p = {
            username: "ListaTareasTestNEGCONP",
            email: "listatareastestNEGconp@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_con_tareas_p);
        id_usuario_con_tareas_p = dao_test.get_id_user(usuario_con_tareas_p.email);

        // añadimos tareas a ese usuario
        let tarea1p = {
            nombre: "Nombre1PNEG",
            prioridad: "ALTA",
            categoria: "@Categoria1PNEG",
            id_usuario: id_usuario_con_tareas,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
            tipo: "p",
            // atributos tarea programada
            horas: 10,
            id_programada: -1,
            tipo_ds: "DIARIA"
        };
        dao_test.insert_task(tarea1p);
        tarea1p.id_programada = dao_test.get_id_task(tarea1p);
        dao_test.insert_task_p(tarea1p);

        let tarea2p = {
            nombre: "Nombre2PNEG",
            prioridad: "BAJA",
            categoria: "@Categoria2PNEG",
            id_usuario: id_usuario_con_tareas,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
            tipo: "p",
            // atributos tarea programada
            horas: 20,
            id_programada: -1,
            tipo_ds: "SEMANAL"
        };
        dao_test.insert_task(tarea2p);
        tarea2p.id_programada = dao_test.get_id_task(tarea2p);
        dao_test.insert_task_p(tarea2p);

        // antes de cada test insertamos ("registramos") un usuario que tenga tareas de ambos tipos
        let usuario_con_tareas = {
            username: "ListaTareasTestNEGCON",
            email: "listatareastestNEGcon@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_con_tareas);
        id_usuario_con_tareas = dao_test.get_id_user(usuario_con_tareas.email);

        // añadimos tareas a ese usuario
        let tarea3m = {
            nombre: "Nombre3MNEG",
            prioridad: "ALTA",
            categoria: "@Categoria3MNEG",
            id_usuario: id_usuario_con_tareas_m,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
            tipo: "m",
            // atributos tarea manual
            id_tarea: -1,
            hora_ini: "14:00",
            hora_fin: "19:00",
            recurrente: 0,
            dias_recurrentes: "@J"
        };
        dao_test.insert_task(tarea3m);
        tarea3m.id_tarea = dao_test.get_id_task(tarea3m);
        dao_test.insert_task_m(tarea3m);

        let tarea3p = {
            nombre: "Nombre3PNEG",
            prioridad: "MEDIA",
            categoria: "@Categoria3PNEG",
            id_usuario: id_usuario_con_tareas,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
            tipo: "p",
            // atributos tarea programada
            horas: 12,
            id_programada: -1,
            tipo_ds: "DIARIA"
        };
        dao_test.insert_task(tarea3p);
        tarea3p.id_programada = dao_test.get_id_task(tarea3p);
        dao_test.insert_task_p(tarea3p);
        
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