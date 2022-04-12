const assert = require("chai").assert;
const chai = require("chai");
const dao = require("../../js/taskDAO");
const mysql = require('mysql');
const config = require('../../js/config');
const pool = mysql.createPool(config.databaseConfig);
const task = new dao(pool);
const moment = require("moment");

const a = moment("1999-1-1");
const b = moment("2041-12-31");

describe("Añadir Tarea Programada", function () {
    it("Debería crear una nueva fila en la BBDD", function(){
        let tareaProgramada = {
            nombre: "Examen MS",
            prioridad: "EXTREMA",
            categoria: "MORICION",
            usuario: 22,
            fechaFin: a.format("YYYY-MM-DD"),
            fechaIni: b.format("YYYY-MM-DD"),

            //estos son los atributos de programada
            horas: 13,
            tipo: "DIARIA" // diaria o semanal 
        };
        task.añadirTareaProgramada(tareaProgramada, function(errors, result) {
            assert.equal(errors, null);
            assert.notEqual(result, null);
            assert.typeOf(result, "object", "debería devolver un objeto");
        });
    });
});