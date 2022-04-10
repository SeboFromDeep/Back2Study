//Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const app = require('../../app');

//Controller Dependencies
const controller = require("../../controller/userController");
const mysql = require('mysql');
const config = require('../../js/config');
const UserController = new controller();
const pool = mysql.createPool(config.databaseConfig);



describe('hooks', function () {

    after(function () {
     
    });

    // tests
    describe("Registrarse correcto", async function () {

        it("Todos los datos del registro son correctos y el usuario no está registrado aún", function (done) {

            // mock para que no llame a render
            chai.request('http://localhost:3300')
            .post('/usuarios/registro_Usuario')
            .send({username:"paco", correo: "paco@gmail.com", password: "1234", password2: "1234"})
            .end(function (err, response) {
                expect(response).to.have.status(200);
                done();
            })
        });

    });

    describe("Registrarse incorrecto", async function () {

        it("Todos los datos del registro son correctos y el usuario no está registrado aún", function (done) {
            // mock para que no llame a render
            chai.request('http://localhost:3300')
            .post('/usuarios/registro_Usuario')
            .send({username:"nene", correo: "nene@gmail.com", password: "1234", password2: "1234"})
            .end(function (err, response) {

                expect(response).to.have.status(200);
                done();
            })
        });

    });

    // describe("Registrarse incorrecto", async function () {

    //     it("Ya hay un usuario registrado con el mismo correo", function (done) {
    //         let request = {
    //             body: {
    //                 username: "maria",
    //                 correo: "paco@gmail.com",
    //                 password: "mariapass",
    //             }
    //         };
    //         done();
    //     });
    // });

});