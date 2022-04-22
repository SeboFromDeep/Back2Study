const assert = require("chai").assert;
const chai = require("chai");
const userdao = require("../../js/userDAO");
const taskdao = require("../../js/taskDAO");
const testDAO = require("../testsDAOMethods");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const pool = mysql.createPool(config.databaseConfig);
const userDao = new userdao(pool);
const taskDao = new taskdao(pool);
const dao_test = new testDAO(pool);

// tests
describe('hooks', function () {

    let id_usuario_con_tareas;

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
        }, 1000);

        // añadimos tareas a ese usuario, una de cada tipo
        let tareaManual = {
            nombre: "NombreMDAO",
            prioridad: "BAJA",
            categoria: "@CategoriaMDAO",
            id_usuario: id_usuario_con_tareas,
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
        dao_test.insert_task(tareaManual);
        setTimeout(function () {
            dao_test.get_id_task(tareaManual, cb_getID);
            function cb_getID(err, getID) {
                tareaManual.id_tarea = getID;
            }
        }, 1000);
        dao_test.insert_task_m(tareaManual);

        let tareaProgramada = {
            nombre: "NombrePDAO",
            prioridad: "ALTA",
            categoria: "@CategoriaPDAO",
            id_usuario: id_usuario_con_tareas,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
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
            }
        }, 1000);
        dao_test.insert_task_p(tareaProgramada);
    });

    after(function () {
        // después de cada test borramos al usuario que se ha insertado para poder ejecutarlos siempre
        setTimeout(function () {
            dao_test.delete_user(id_usuario_con_tareas);
        }, 1000);
    })

    describe("Ver detalles de tarea", function () {

        it("Ver detalles tarea manual", function () {
            task.getDetailsTaskManual(id_usuario_con_tareas, tareaManual.id_tarea).then(value => {
                assert.equal(value, true);
            });

        });

        it("Ver detalles tarea programada", function () {
            task.listaTareas(id_usuario_con_tareas, tareaProgramada.id_programada).then(value => {
                assert.equal(value, false);
            });

        });
    });

});