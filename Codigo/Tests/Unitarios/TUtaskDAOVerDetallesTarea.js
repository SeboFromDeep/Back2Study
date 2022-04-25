const assert = require("chai").assert;
const chai = require("chai");
const expect = require('chai').expect;
const moment = require("moment");
const dao = require("../../js/taskDAO");
const testDAO = require("../testsDAOMethods");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const pool = mysql.createPool(config.databaseConfig);
const task = new dao(pool);
const dao_test = new testDAO(pool);

const ini = moment("2022-05-10");
const fin = moment("2022-05-30");

// tests
describe('hooks', function () {

    let id_usuario_con_tareas;
    let tareaManual, tareaProgramada;

    before(async function () {
        // antes de cada test insertamos ("registramos") un usuario para que tenga tareas
        let usuario = {
            username: "VerDetalleTareaTestDAO",
            email: "verdetalletareatestDAO@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario).then(value => {
            expect(value).eq(true);
        });
        await dao_test.get_id_user(usuario.email)
            .then(value => {
                if (value) {
                    id_usuario_con_tareas = value;

                    // añadimos tareas a ese usuario, una de cada tipo
                    tareaManual = {
                        nombre: "NombreMDAO",
                        prioridad: "BAJA",
                        categoria: "@CategoriaMDAO",
                        id_usuario: id_usuario_con_tareas,
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
                        nombre: "NombrePDAO",
                        prioridad: "ALTA",
                        categoria: "@CategoriaPDAO",
                        id_usuario: id_usuario_con_tareas,
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

    });

    describe("Ver detalles de tarea", function () {

        it("Ver detalles tarea manual", async function () {
            await task.getDetailsTaskManual(id_usuario_con_tareas, tareaManual.id_tarea).then(value => {
                assert.equal(value[0].nombre, tareaManual.nombre);
                assert.equal(value[0].prioridad, tareaManual.prioridad);
                assert.equal(value[0].categoria, tareaManual.categoria);
                assert.equal(moment(value[0].fechafin).format("YYYY-MM-DD"), tareaManual.fechafin);
                assert.equal(moment(value[0].fechaini).format("YYYY-MM-DD"), tareaManual.fechaini);
                assert.equal(value[0].tipo, tareaManual.tipo);
                assert.equal(value[0].hora_ini, tareaManual.hora_ini);
                assert.equal(value[0].hora_fin, tareaManual.hora_fin);
                assert.equal(value[0].recurrente, tareaManual.recurrente);
                assert.equal(value[0].dias_recurrentes, tareaManual.dias_recurrentes);
            });

        });

        it("Ver detalles tarea programada", async function () {
            await task.getDetailsTaskProgram(id_usuario_con_tareas, tareaProgramada.id_programada).then(value => {
                assert.equal(value[0].nombre, tareaProgramada.nombre);
                assert.equal(value[0].prioridad, tareaProgramada.prioridad);
                assert.equal(value[0].categoria, tareaProgramada.categoria);
                assert.equal(moment(value[0].fechafin).format("YYYY-MM-DD"), tareaProgramada.fechafin);
                assert.equal(moment(value[0].fechaini).format("YYYY-MM-DD"), tareaProgramada.fechaini);
                assert.equal(value[0].horas, tareaProgramada.horas);
                assert.equal(value[0].tipo, tareaProgramada.tipo_ds);
            });

        });

    });

    after(async function () {
        // después de cada test borramos al usuario que se ha insertado para poder ejecutarlos siempre
        await dao_test.delete_user(id_usuario_con_tareas);
    });

});