const assert = require("chai").assert;
const chai = require("chai");
const dao = require("../../js/taskDAO");
const testDAO = require("./testsDAOMethods");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const pool = mysql.createPool(config.databaseConfig);
const task = new dao(pool);
const dao_test = new testDAO(pool);

// tests
describe('hooks', function () {

    let id_usuario_con_tareas, id_usuario_sin_tareas;

    before(function () {
        // antes de cada test insertamos ("registramos") un usuario para que tenga tareas
        let usuario_con_tareas = {
            username: "ListaTareasTestDAOCON",
            email: "listatareastestDAOcon@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_con_tareas);
        id_usuario_con_tareas = dao_test.get_id_user(usuario_con_tareas.email);

        // PONER BIEN LOS ATRIBUTOS DE LAS TAREAS, CAMBIOS EN LA BD

        // añadimos tareas a ese usuario
        let tarea1 = {
            nombre: "Nombre1DAO",
            prioridad: "BAJA",
            categoria: "Categoria1DAO",
            id_usuario: id_usuario_con_tareas,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
            tipo: "m"
        };
        let tarea2 = {
            nombre: "Nombre2DAO",
            prioridad: "ALTA",
            categoria: "Categoria2DAO",
            id_usuario: id_usuario_con_tareas,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
            tipo: "p"
        };     
        dao_test.insert_task(tarea1);
        dao_test.insert_task(tarea2);   
        // antes de cada test insertamos ("registramos") un usuario que no tenga tareas
        let usuario_sin_tareas = {
            username: "ListaTareasTestDAOSIN",
            email: "listatareastestDAOsin@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_sin_tareas);
        id_usuario_sin_tareas = dao_test.get_id_user(usuario_con_tareas.email);
    });

    after(function () {
        // después de cada test borramos las tareas del usuario para poder ejecutarlos siempre
        let id_tarea1 = dao_test.get_id_task(tarea1);
        dao_test.delete_task(id_tarea1);
        let id_tarea2 = dao_test.get_id_task(tarea2);
        dao_test.delete_task(id_tarea2);
        // después de cada test borramos a los usuarios que se han insertado para poder ejecutarlos siempre
        dao_test.delete_user(id_usuario_con_tareas);
        dao_test.delete_user(id_usuario_sin_tareas);
    });

    describe("Listar tareas", function () {

        it("Usuario con tareas", function () {
            task.listaTareas(id_usuario_con_tareas).then(value => {
                assert.equal(value, true);
            });

        });

        it("Usuario sin tareas", function () {
            task.listaTareas(id_usuario_sin_tareas).then(value => {
                assert.equal(value, false);
            });

        });

    });

});