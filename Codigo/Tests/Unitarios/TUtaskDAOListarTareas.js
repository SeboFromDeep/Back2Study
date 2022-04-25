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

    let id_usuario_con_tareas, id_usuario_sin_tareas;

    before(async function () {
        // antes de cada test insertamos ("registramos") un usuario para que tenga tareas
        let usuario_con_tareas = {
            username: "ListaTareasTestDAOCON",
            email: "listatareastestDAOcon@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario_con_tareas).then(value => {
            expect(value).eq(true);
        });
        await dao_test.get_id_user(usuario_con_tareas.email)
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

        // antes de cada test insertamos ("registramos") un usuario que no tenga tareas
        let usuario_sin_tareas = {
            username: "ListaTareasTestDAOSIN",
            email: "listatareastestDAOsin@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario_sin_tareas).then(value => {
            expect(value).eq(true);
        });
        await dao_test.get_id_user(usuario_sin_tareas.email)
            .then(value => {
                if (value)
                    id_usuario_sin_tareas = value;
            });
    });

    describe("Listar tareas", function () {

        it("Usuario con tareas", async function () {
            await task.listaTareas(id_usuario_con_tareas).then(value => {
                assert.notEqual(value, false);
            });

        });

        it("Usuario sin tareas", async function () {
            await task.listaTareas(id_usuario_sin_tareas).then(value => {
                assert.equal(value, false);
            });

        });

    });

    after(async function () {
        // después de cada test borramos a los usuarios que se han insertado para poder ejecutarlos siempre
        await dao_test.delete_user(id_usuario_con_tareas);
        await dao_test.delete_user(id_usuario_sin_tareas);

    });

});