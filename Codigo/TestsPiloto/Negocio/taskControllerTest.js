//const chai = require("chai");
const assert = require("chai").assert;

const taskController = new require("../../controllers/taskController");

const moment = require("moment");
const a = moment("1999-1-1");
const b = moment("2041-12-31");

describe("Añadir Tarea Manual", function () {
    it("Debería comunicarse correctamente con el DAO y redireccionar a vista si el DAO funciona", function() {
        let request = {
            body: { 
                nombre: "Examen MS",
                prioridad: "EXTREMA",
                categoria: "MORICION",
                usuario: 22,
                fechaFin: a.format("YYYY-MM-DD"),
                fechaIni: b.format("YYYY-MM-DD"),

                //estos son los atributos de programada
                horas: 13,
                tipo: "DIARIA" // diaria o semanal 
            },
            session: {

            }
        };

        taskController.añadirTareaProgramada(tareaProgramada, function(errors, result) {
            assert.equal(errors, null);
            assert.notEqual(result, null);
            assert.typeOf(result, "object", "debería devolver un objeto");
        });
    });
});