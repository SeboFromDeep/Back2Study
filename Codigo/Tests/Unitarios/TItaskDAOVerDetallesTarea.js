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
const taskDao =  new taskdao(pool);
const dao_test = new testDAO(pool);

// tests
describe("Listar tareas", function () {

    let id_usuario_con_tareas;
    let id_tarea_m, id_tarea_p;

    before(function () {
        // antes de cada test insertamos ("registramos") un usuario para que tenga tareas
        let usuario = {
            username: "VerDetalleTareaTestDAO",
            email: "verdetalletareatestDAO@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario);
        id_usuario_con_tareas = dao_test.get_id_user(usuario.email);

        // PONER BIEN LOS ATRIBUTOS DE LAS TAREAS, CAMBIOS EN LA BD
        // añadimos tareas a ese usuario, una de cada tipo
        let tareaManual = {
            nombre: "NombreMDAO",
            prioridad: "BAJA",
            categoria: "CategoriaMDAO",
            id_usuario: id_usuario_con_tareas,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
            tipo: "m"
        };
        dao_test.insert_task(tareaManual);
        id_tarea_m = dao_test.get_id_task(tareaManual);
        dao_test.insert_task_m(tareaManual);
        let tareaProgramada = {
            nombre: "NombrePDAO",
            prioridad: "ALTA",
            categoria: "CategoriaPDAO",
            id_usuario: id_usuario_con_tareas,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
            tipo: "p",
            // atributos tarea programada
            horas: 10,
            tipo_ds: "DIARIA"
        };
        dao_test.insert_task(tareaProgramada);
        id_tarea_p = dao_test.get_id_task(tareaProgramada);
        dao_test.insert_task_p(tareaProgramada);

    });

    after(function () {
        // después de cada test borramos las tareas del usuario para poder ejecutarlos siempre
        dao_test.delete_task(id_tarea_m);
        dao_test.delete_task(id_tarea_p);
        // después de cada test borramos al usuario que se ha insertado para poder ejecutarlos siempre
        dao_test.delete_user(id_usuario_con_tareas);
    })

    it("Ver detalles tarea manual", function () {
        task.getDetailsTaskManual(id_usuario_con_tareas, id_tarea_m).then(value => {
            assert.equal(value, true);
        });

    });

    it("Ver detalles tarea programada", function () {
        task.listaTareas(id_usuario_con_tareas, id_tarea_p).then(value => {
            assert.equal(value, false);
        });

    });

});