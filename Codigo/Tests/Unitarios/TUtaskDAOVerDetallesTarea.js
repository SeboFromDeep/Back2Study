const assert = require("chai").assert;
const chai = require("chai");
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

    before(function () {
        // antes de cada test insertamos ("registramos") un usuario para que tenga tareas
        let usuario = {
            username: "VerDetalleTareaTestDAO",
            email: "verdetalletareatestDAO@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario);
        setTimeout(function () {
            dao_test.get_id_user(usuario.email, cb_getID);
            function cb_getID(err, getID) {
                id_usuario_con_tareas = getID;
            }

            setTimeout(function () {

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
                dao_test.insert_task(tareaManual);
                setTimeout(function () {
                    dao_test.get_id_task(tareaManual, cb_getID);
                    function cb_getID(err, getID) {
                        tareaManual.id_tarea = getID;
                        dao_test.insert_task_m(tareaManual);
                    }
                }, 500);

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
                dao_test.insert_task(tareaProgramada);
                setTimeout(function () {
                    dao_test.get_id_task(tareaProgramada, cb_getID);
                    function cb_getID(err, getID) {
                        tareaProgramada.id_programada = getID;
                        dao_test.insert_task_p(tareaProgramada);
                    }
                }, 500);

            }, 500);

        }, 500);
    });

    after(function () {
        // después de cada test borramos al usuario que se ha insertado para poder ejecutarlos siempre
        dao_test.delete_user(id_usuario_con_tareas);
    })

    describe("Ver detalles de tarea", function () {

        it("Ver detalles tarea manual", function () {
            console.log("Mostrando id m");
            console.log(tareaManual.id_tarea);
            task.getDetailsTaskManual(id_usuario_con_tareas, tareaManual.id_tarea).then(value => {
                assert.equal(value, true);
            });

        });

        it("Ver detalles tarea programada", function () {
            console.log("Mostrando id p");
            console.log(tareaProgramada.id_programada);
            task.listaTareas(id_usuario_con_tareas, tareaProgramada.id_programada).then(value => {
                assert.equal(value, false);
            });

        });

    });

});