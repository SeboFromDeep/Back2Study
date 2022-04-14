//Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const app = require('../../app');
const url='http://localhost:3300';

//Controller Dependencies
const controller = require("../../controller/taskController");
const mysql = require('mysql');
const config = require('../../js/config');
const taskController = new controller();
const UserController = new controller();
const { getMaxListeners } = require("../../app");
const dao = require("../../js/taskDAO");
const pool = mysql.createPool(config.databaseConfig);
const dao_aux = new dao(pool);


describe('hooks', function () {

     // tests
     describe("Ver detalle de tarea", function () {

        it("Ver detalle de una determinada tarea de un usuario", async function () {
            
            let agent = chai.request.agent(url);
            await agent.post('/usuarios/login_user')
            .send({correo:'userPrueba1@email.com', password:'1234'})
            .then((res) => {
                    this.timeout(30000);
                    console.log(res.boody);
                    agent.get('/tareas/taskDetalisBy/1/p')
                    .end((err, res, body) => {
                        expect(res).to.have.status(200);
                    });
            });
      
        });
     });

     /*Este último test falla, creo es problema del controller ya que quiero probar ver detalles de una tarea
     de un usuario que no tiene ninguna tarea asignada, me tendría que devolver un status de 500 al no tener ninguna pero 
     me devuelve uno de 200 como si la tuviese. */
     describe("Error ver detalle de tarea", function () {

        it("Error al intentar ver detalle de alguna determinada tarea de un usuario que no tiene tareas", async function () {
            
            let agent = chai.request.agent(url);
            await agent.post('/usuarios/login_user')
            .send({correo:'steven@email.com', password:'1234'})
            .then((res) => {
                    this.timeout(30000);
                    console.log(res.boody);
                    agent.get('/tareas/taskDetalisBy/1/p')
                    .end((err, res, body) => {
                        expect(res).to.have.status(500);
                    });
            });
      
        });
     });

});