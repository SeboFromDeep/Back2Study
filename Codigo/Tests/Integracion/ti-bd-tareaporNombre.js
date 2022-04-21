const assert = require("chai").assert;
const chai = require("chai");
const dao = require("../../js/taskDAO");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const { expect } = require("chai");
const pool = mysql.createPool(config.databaseConfig);
const task = new dao(pool);

// tests
describe("Buscar tareas por Nombre", async function () {

    it("Debería devolver exactamente la misma lista", async function () {
        let id_usuario = 2, nombre= "Estudio de Boostrap";

        //Haría la lista de las tareas del usuario 2 con nombre Estudio de Boostrap
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
            id_tarea: 5,
            nombre: "Estudio de Boostrap",
            prioridad: "MEDIA",
            categoria: "@WEB",
            fechafin: fecha1,
            fechaini: fecha2,
            tipo: "p",
        }

       await task.BuscarTareaPorNombre(nombre, id_usuario).then(value => {
            expect(value[0]).to.deep.equal(prueba);
        });

    });

    it("No debería devolver nada", async function () {
        let id_usuario = 2, nombre= "@INEXISTENTE";
        await task.BuscarTareaPorNombre(nombre, id_usuario).then(value => {
            expect(value).to.equal(false);
        });


    })
});