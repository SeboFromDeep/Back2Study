const assert = require("chai").assert
const chai = require("chai")
const dao = require("../taskDAO")
const mysql = require('mysql')
const config = require('../config');
const pool = mysql.createPool(config.databaseConfig)
const task = new dao(pool)

describe("TaskDAO", function() {
    it("Debería crear una nueva fila en la BBDD", function(){
        let tareaManual = {
            nombre: 'Examen_GPS',
            prioridad: 'alta',
            categoria: '@Examen',
            usuario: '1',
            fechafin: '2022-04-12',
            fechaIni: '2022-04-01',
            hora_ini: '12:00',
            hora_fin: '15:00',
            recurrente: '1',
            dias_recurrentes: '@L@X',
        };
        task.añadirTareaRapida(tareaManual, function(errors, valid){
            chai.assert.equal(errors, null);
            chai.assert.notEqual(result, null);
            chai.assert.typeOf(result, "object", "debería devolver un objeto");
        })

        });
    });