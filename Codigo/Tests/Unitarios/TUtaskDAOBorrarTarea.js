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

    let usuario;
    let tareaManual, tareaProgramada;
    let id_usuario;

    before(async function () {
        // antes de cada test insertamos ("registramos") un usuario para que tenga tareas
        usuario = {
            username: "BorrarTareasTestDAO",
            email: "borrartareastestDAO@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario).then(value => {
            expect(value).eq(true);
        });
        await dao_test.get_id_user(usuario.email)
            .then(value => {
                if (value) {
                    id_usuario = value;

                    // añadimos tareas a ese usuario, una de cada tipo
                    tareaManual = {
                        nombre: "NombreMDAO",
                        prioridad: "BAJA",
                        categoria: "@CategoriaMDAO",
                        id_usuario: id_usuario,
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
                        id_usuario: id_usuario,
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

    describe("Borrar tareas", function () {

        it("Borrar tarea manual", async function () {
            await task.deleteTask(id_usuario, tareaManual.id_tarea).then(value => {
                expect(value).to.equal(tareaManual.id_tarea);
            });

        });

        it("Borrar tarea programada", async function () {
            await task.deleteTask(id_usuario, tareaProgramada.id_programada).then(value => {
                expect(value).to.equal(tareaProgramada.id_programada);
            });

        });

    });

    after(async function () {
        // después de cada test borramos al usuario que se ha insertado para poder ejecutarlos siempre
        await dao_test.delete_user(id_usuario);
    });

});