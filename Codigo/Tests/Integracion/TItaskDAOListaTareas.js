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

    before(function () {
        // antes de cada test insertamos ("registramos") un usuario para que tenga tareas
        let usuario_con_tareas = {
            username: "ListaTareasTestCON",
            email: "listatareastestcon@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_con_tareas);
        // añadimos tareas a ese usuario
        let tarea1 = {
            nombre: "Nombre1",
            prioridad: "BAJA",
            categoria: "Categoria1",
            id_usuario: 0,
            fechafin: "2022-10-10",
            fechaini: "2022-10-01",
            tipo: "m"
        };
        tarea1.id_usuario = dao_test.get_id_user(usuario_con_tareas.email);
        let tarea2 = {
            nombre: "Nombre2",
            prioridad: "ALTA",
            categoria: "Categoria2",
            id_usuario: tarea1.id_usuario,
            fechafin: "2022-11-11",
            fechaini: "2022-11-01",
            tipo: "p"
        };     
        dao_test.insert_task(tarea1);
        dao_test.insert_task(tarea2);   
        // antes de cada test insertamos ("registramos") un usuario que no tenga tareas
        let usuario_sin_tareas = {
            username: "ListaTareasTestSIN",
            email: "listatareastestsin@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_sin_tareas);
    });

    after(function () {
        // después de cada test borramos las tareas del usuario para poder ejecutarlos siempre
        
        // después de cada test borramos a los usuarios que se han insertado para poder ejecutarlos siempre
        dao_test.delete_user(usuario_con_tareas.email);
        dao_test.delete_user(usuario_sin_tareas.email);
    });

    describe("Listar tareas", function () {

        it("Usuario con tareas", function () {
            let id_usuario = 1;
            task.listaTareas(id_usuario).then(value => {
                assert.equal(value, true);
            });

        });

        it("Usuario sin tareas", function () {
            let id_usuario = 3;
            task.listaTareas(id_usuario).then(value => {
                assert.equal(value, false);
            });

        });

    });

});