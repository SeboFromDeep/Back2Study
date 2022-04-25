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
describe("Buscar tareas por categoria", function() {
    before(async function () {
        // antes de cada test insertamos un usuario y sus tareas
        let usuario = {
            username: "buscartareascategoriatest",
            email: "buscartareascategoriatest@gmail.com",
            password: "1234"
        };
        await dao_test.insert_user(usuario).then(value => {
            expect(value).eq(true);
        });

        let id;
        await dao_test.get_id_user(usuario.email)
        .then(value => {
            if (value) id=value;
        });

        let tarea1 = {
            nombre: "Tareadeprueba",
            prioridad: "MEDIA",
            categoria: "@WEB",
            id_usuario: id,
            fechafin: ini.format("YYYY-MM-DD"),
            fechaini: fin.format("YYYY-MM-DD"),
            tipo: "p"
        };
       await dao_test.insert_task(tarea1).then(value => {
           expect(value).eq(true);
       });

        let tarea2 = {
            nombre: "Otratarea",
            prioridad: "BAJA",
            categoria: "@GPS",
            id_usuario: id,
            fechafin: ini2.format("YYYY-MM-DD"),
            fechaini: fin2.format("YYYY-MM-DD"),
            tipo: "p"
        };
        await dao_test.insert_task(tarea2).then(value => {
            expect(value).eq(true);
        });
    })

    after(async function() {
        // después de cada test borramos todo lo que hemos insertado
        let id;
        await dao_test.get_id_user("buscartareascategoriatest@gmail.com")
        .then(value => {
            if (value) id=value;
        });

        await dao_test.delete_user(id);
    });


    it("Debería devolver exactamente la misma lista", async function() {
        let id, id_tarea1, categoria= "@WEB";
        await dao_test.get_id_user("buscartareascategoriatest@gmail.com")
        .then(value => {
            if (value) id=value;
        });

        let tarea1 = {
            nombre: "Tareadeprueba",
            prioridad: "MEDIA",
            categoria: "@WEB",
            id_usuario: id,
            fechafin: ini.format("YYYY-MM-DD"),
            fechaini: fin.format("YYYY-MM-DD"),
            tipo: "p"
        };
        await dao_test.get_id_task(tarea1)
        .then(value => {
            if (value) id_tarea1=value;
        });

        //Hacemos la lista de las tareas del usuario insertado con categoria @WEB para comparar

        //Código para que no peten las fechas
        const dateTime = '2022-04-18 00:00:00';
        let dateTimeParts= dateTime.split(/[- :]/); // regular expression split that creates array with: year, month, day, hour, minutes, seconds values
        dateTimeParts[1]--; // monthIndex begins with 0 for January and ends with 11 for December so we need to decrement by one
        const fecha1 = new Date(...dateTimeParts); // our Date object
        const dateTime2 = '2022-05-10 00:00:00';
        let dateTimeParts2= dateTime2.split(/[- :]/); // regular expression split that creates array with: year, month, day, hour, minutes, seconds values
        dateTimeParts2[1]--; // monthIndex begins with 0 for January and ends with 11 for December so we need to decrement by one
        const fecha2 = new Date(...dateTimeParts2); // our Date object

        let prueba = {
            id_tarea: id_tarea1,
            nombre: "cosa",
            prioridad: "MEDIA",
            categoria: "@WEB",
            fechafin: fecha1,
            fechaini: fecha2,
            tipo: "p",
        }

        await task.buscarTareasporCategoria(categoria, id).then(value => {
            expect(value[0]).to.deep.equal(prueba);
        });

    });

    it("No debería devolver nada", async function() {
        let id, categoria= "@INEXISTENTE";
       await dao_test.get_id_user("buscartareascategoriatest@gmail.com")
        .then(value => {
            if (value) id=value;
        });

        await task.buscarTareasporCategoria(categoria, id).then(value => {
            expect(value).to.equal(false);
        });


    })
});