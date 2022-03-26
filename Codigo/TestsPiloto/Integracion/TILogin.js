const assert = require("chai").assert;
const chai = require("chai");
const dao = require("../../js/userDAO");
const controller = require("../../controller/userController")
const mysql = require('mysql');
const config = require('../../js/config');
const pool = mysql.createPool(config.databaseConfig);
const user = new controller();


describe("Iniciar sesion", function () {
    it("Debería acceder a la BBDD", function(){
        let request = {
            body: {
                correo: "prueba@gmail.com",
                password: "1234",
            },
            
            session:{
                id_: 26,
                mail: "prueba@gmail.com",
                userName: "prueba",
            },
            
        };

        user.login(request,function(errors, result){
            assert.equal(errors, null);
            assert.notEqual(result, null);
        })
    });
});

