const assert = require("chai").assert
const chai = require("chai")
const dao = require("../../Codigo/js/userDAO")
const mysql = require('mysql')
const config = require('../../Codigo/js/config');
const pool = mysql.createPool(config.databaseConfig)
const user = new dao(pool)
require('../cleanUserTableData')


describe("UserDAO login", function () {
    
    it("El usuario ya esta registrado en la bd con la contraseña correcta", function(){
        let usuario = {
            correo: 'testemail@gmail.com',
            pass: '1234',
        };
        

        user.login(usuario, function(errors,userlogin){
            chai.assert.equal(errors, null);
            chai.assert.equal(userlogin.name, user.correo);
        })
    });

<<<<<<< HEAD
=======
describe("UserDAO", function () {
>>>>>>> 87ed2693e35dca61d9dce41fa044aec8bd003694
    it("El usuario no esta registrado en la bd", function(){
        let usuario = {
            correo: 'noregister@gmail.com',
            pass: '1234',
        };
        user.login(usuario, function(errors,userlogin){
            //si error no es nulo es que el dao no ha encontrado al usuario
            chai.assert.notEqual(error,null)
        })
    });

    it("El usuario esta registrado en la bd pero la contraseña es incorrecta", function(){
        let usuario = {
            correo: 'testemail@gmail.com',
            pass: '',
        };
        user.login(usuario, function(errors,userlogin){
            //si error no es nulo es que el dao encuentra al usario pero la contraseña no es correcta
            chai.assert.notEqual(error,null)
        })
    });

});
