const assert = require("chai").assert;
const chai = require("chai");
const userdao = require("../../js/userDAO");
const taskdao = require("../../js/taskDAO");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const pool = mysql.createPool(config.databaseConfig);
const userDao = new userdao(pool);
const taskDao =  new taskdao(pool);

// tests
describe("Listar tareas", function () {

    let id;
    before(function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        let nuevoUsuario = {
            nombre: "paco",
            correo: "paco@gmail.com",
            pass: "pacopass",
        };
        userDao.registro(nuevoUsuario).then(value => {
            id=value;
            assert.equal(value, true);

        });

        let tareaProgramada = {
            nombre: "Examen MS",
            prioridad: "EXTREMA",
            categoria: "MORICION",
            usuario: id,
            fechaFin: a.format("YYYY-MM-DD"),
            fechaIni: b.format("YYYY-MM-DD"),

            //estos son los atributos de programada
            horas: 13,
            tipo: "DIARIA" // diaria o semanal 
        };
        taskDao.añadirTareaProgramada(tareaProgramada, function(errors, result) {
            assert.equal(errors, null);
            assert.notEqual(result, null);
            assert.typeOf(result, "object", "debería devolver un objeto");
        });

    });

    it("Ver detalles manual", function () {
        let id_usuario = 1;
        task.listaTareas(id_usuario).then(value => {
            assert.equal(value, true);
        });

    });

    it("Ver detalles programada", function () {
        let id_usuario = 3;
        task.listaTareas(id_usuario).then(value => {
            assert.equal(value, false);
        });

    });

});