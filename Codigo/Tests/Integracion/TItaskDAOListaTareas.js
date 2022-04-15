const assert = require("chai").assert;
const chai = require("chai");
const dao = require("../../js/taskDAO");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const pool = mysql.createPool(config.databaseConfig);
const task = new dao(pool);

// tests
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