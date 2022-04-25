const assert = require("chai").assert;
const chai = require("chai");
const dao = require("../../js/taskDAO");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const { expect } = require("chai");
const pool = mysql.createPool(config.databaseConfig);
const task = new dao(pool);
const testDAO = require("../testsDAOMethods");
const dao_test = new testDAO(pool);
const moment = require("moment");

const ini = moment("2022-04-18");
const fin = moment("2022-05-10");
const ini2 = moment("2022-04-25");
const fin2 = moment("2022-05-17");

// tests
describe("Buscar tareas por nombre", function () {

    let usuario;
    let id_usuario;
    let tareaManual, tareaProgramada;

    before(async function () {
        // antes de cada test insertamos un usuario y sus tareas
        usuario = {
            username: "BuscarTareasNombreTestDAO",
            email: "buscartareasnombretestDAO@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario).then(value => {
            expect(value).eq(true);
        });
        await dao_test.get_id_user(usuario.email)
            .then(value => {
                if (value) id_usuario = value;

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
    })

    describe("Buscar tarea por nombre", function () {

        it("Debería devolver exactamente la misma lista", async function () {
            let id, id_tarea1, nombre = "Tareade";
            await dao_test.get_id_user("buscartareasnombretest@gmail.com")
                .then(value => {
                    if (value) id = value;
                });

            let tarea1 = {
                nombre: "Tareadeprueba",
                prioridad: "MEDIA",
                categoria: "@WEB",
                id_usuario: id,
                fechafin: fin.format("YYYY-MM-DD"),
                fechaini: ini.format("YYYY-MM-DD"),
                tipo: "p"
            };
            await dao_test.get_id_task(tarea1)
                .then(value => {
                    if (value) id_tarea1 = value;
                });

            //Hacemos la lista de las tareas del usuario insertado cuyo nombre contenga "tareade" para comparar

            // Código para que no peten las fechas
            const dateTime = '2022-04-18 00:00:00';
            let dateTimeParts = dateTime.split(/[- :]/); // regular expression split that creates array with: year, month, day, hour, minutes, seconds values
            dateTimeParts[1]--; // monthIndex begins with 0 for January and ends with 11 for December so we need to decrement by one
            const fecha1 = new Date(...dateTimeParts); // our Date object
            const dateTime2 = '2022-05-10 00:00:00';
            let dateTimeParts2 = dateTime2.split(/[- :]/); // regular expression split that creates array with: year, month, day, hour, minutes, seconds values
            dateTimeParts2[1]--; // monthIndex begins with 0 for January and ends with 11 for December so we need to decrement by one
            const fecha2 = new Date(...dateTimeParts2); // our Date object

            let prueba = {
                id_tarea: id_tarea1,
                nombre: "Tareadeprueba",
                prioridad: "MEDIA",
                categoria: "@WEB",
                fechafin: fecha2,
                fechaini: fecha1,
                tipo: "p",
            }

            await task.buscarTareaPorNombre(nombre, id).then(value => {
                expect(value[0]).to.deep.equal(prueba);
            });

        });

        it("No debería devolver nada", async function () {
            let id, nombre = "Notarea";
            await dao_test.get_id_user("buscartareasnombretest@gmail.com")
                .then(value => {
                    if (value) id = value;
                });

            await task.buscarTareaPorNombre(nombre, id).then(value => {
                expect(value).to.equal(false);
            });


        })

    });

    after(async function () {
        // después de cada test borramos al usuario que se ha insertado para poder ejecutarlos siempre
        await dao_test.delete_user(id_usuario);
    });

});