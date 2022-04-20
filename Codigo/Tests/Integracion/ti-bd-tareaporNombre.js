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

    before(function () {
        //Antes de cada test insertamos un usuario y varias tareas
    
    })
    
    it("Debería devolver exactamente la misma lista", async function () {
        let id_usuario = 1, nombre= "Estudio de Bootstrap";
        //Haría la lista de las tareas del usuario 2 con categoria @WEB
        const dateTime = '2022-04-18 00:00:00';
        let dateTimeParts= dateTime.split(/[- :]/); // regular expression split that creates array with: year, month, day, hour, minutes, seconds values
        dateTimeParts[1]--; // monthIndex begins with 0 for January and ends with 11 for December so we need to decrement by one
        const fecha1 = new Date(...dateTimeParts); // our Date object
        const dateTime2 = '2022-04-20 00:00:00';
        let dateTimeParts2= dateTime2.split(/[- :]/); // regular expression split that creates array with: year, month, day, hour, minutes, seconds values
        dateTimeParts2[1]--; // monthIndex begins with 0 for January and ends with 11 for December so we need to decrement by one
        const fecha2 = new Date(...dateTimeParts2); // our Date object

        let prueba = {
            id_tarea: 2,
            nombre: "Entrenamiento",
            prioridad: "ALTA",
            categoria: "@VERANO",
            fechafin: fecha1,
            fechaini: fecha2,
            tipo: "m",
        }

       await task.BuscarTareaPorNombre(nombre, id_usuario).then(value => {
            expect(value[0]).to.deep.equal(prueba);
        });

    });


});