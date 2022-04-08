const assert = require("chai").assert;
const chai = require("chai");
const controller = require("../../controller/userController");
const dao = require("../../js/userDAO");
const mysql = require('mysql');
const config = require('../../js/config');
const sinon = require('sinon');
const task = new controller();


describe("Iniciar sesion correcto", function () {

    it("Correo y contraseña correctos", function() {
        let request = {
            body: {
                correo: "testemail@gmail.com",
                password: "1234",
            },
            
            session:{
                id_: 23,
                mail: "testemail@gmail.com",
                userName: "prueba",
            },
            
        };

        // mock para que no llame a render
        var mock = sinon.mock(task);
        var expectation_1 = mock.expects("response.render");
        expectation_1.exactly(1);
        var expectation_2 = mock.expects("response.status");
        expectation_2.atMost(1);
        task.login(request, function(errors, result) {
            assert.equal(errors, null);
            assert.notEqual(result, null);
        })
        mock.verify();

    });

});

describe("Iniciar sesion incorrecto", function () {

    it("Correo no registrado en la BD", function() {
        let request = {
            body: {
                correo: "noregister@gmail.com",
                password: "1234",
            },
            
            session:{
                id_: 23,
                mail: "noregister@gmail.com",
                userName: "prueba",
            },
            
        };

        // mock para que no llame a render
        var mock = sinon.mock(task);
        var expectation_1 = mock.expects("response.render");
        expectation_1.exactly(1);
        var expectation_2 = mock.expects("response.status");
        expectation_2.atMost(1);
        task.login(request, function(errors, result) {
            assert.equal(errors, null);
            assert.equal(result, false);
        })
        mock.verify();

    });

});

describe("Iniciar sesion correcto", function () {

    it("Correo registrado pero contraseña incorrecta", function() {
        let request = {
            body: {
                correo: "testemail@gmail.com",
                password: "4321",
            },
            
            session:{
                id_: 23,
                mail: "testemail@gmail.com",
                userName: "4321",
            },
            
        };

        // mock para que no llame a render
        var mock = sinon.mock(task);
        var expectation_1 = mock.expects("response.render");
        expectation_1.exactly(1);
        var expectation_2 = mock.expects("response.status");
        expectation_2.atMost(1);
        task.login(request, function(errors, result) {
            assert.equal(errors, null);
            assert.equal(result, false);
        })
        mock.verify();
        
    });

});

