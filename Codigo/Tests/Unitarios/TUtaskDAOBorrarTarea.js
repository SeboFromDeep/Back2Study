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

    before(async function () {
        // antes de cada test insertamos ("registramos") un usuario para que tenga tareas
        let id_usuario, usuario = {
            username: "BorrarTareasdaotest",
            email: "borrartareasdaotest@gmail.com",
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
                    tarea = {
                        nombre: "PruebaBorrar",
                        prioridad: "BAJA",
                        categoria: "@CategoriaBorrar",
                        id_usuario: id_usuario,
                        fechafin: fin.format("YYYY-MM-DD"),
                        fechaini: ini.format("YYYY-MM-DD"),
                        tipo: "m",
                    };
                }
            });

        await dao_test.insert_task(tarea).then(value => {
            expect(value).eq(true);
        });
    });

    describe("Borrar tareas", function () {


        it("Borra con exito", async function () {
        let id_usuario, id_tarea;
        await dao_test.get_id_user("borrartareasdaotest@gmail.com")
        .then(value => {
            if(value) id_usuario=value;
        });
        
        tarea = {
            nombre: "PruebaBorrar",
            prioridad: "BAJA",
            categoria: "@CategoriaBorrar",
            id_usuario: id_usuario,
            fechafin: fin.format("YYYY-MM-DD"),
            fechaini: ini.format("YYYY-MM-DD"),
            tipo: "m",
        };

        await dao_test.get_id_task(tarea)
        .then(value => {
            if(value) id_tarea=value;
        });

        await task.deleteTask(id_usuario, id_tarea).then(value => {
                expect(value).to.equal(id_tarea);
            });

        });

    });

    after(async function () {
        // después de cada test borramos a los usuarios que se han insertado para poder ejecutarlos siempre
        let id_usuario;
        await dao_test.get_id_user("borrartareasdaotest@gmail.com")
            .then(value => {
                if (value) id_usuario = value;
            });
        await dao_test.delete_user(id_usuario);
    });

});