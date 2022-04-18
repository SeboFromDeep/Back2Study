// Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const app = require('../../app');
const url='http://localhost:3300';

// Controller Dependencies
const controller = require("../../controller/userController");
const mysql = require('mysql');
const config = require('../../js/config');
const UserController = new controller();
const dao = require("../../js/userDAO");
const { getMaxListeners } = require("../../app");
const pool = mysql.createPool(config.databaseConfig);
const UserDao = new dao(pool);

// tests
describe("Borrar tarea", function () {

    it("Borrar tarea", async function () {

        let agent = chai.request.agent(url);
        await agent.post('/usuarios/login_user')
            .send({ correo: 'userPrueba1@email.com', password: '1234' })
            .then((res) => {
                this.timeout(30000);
                agent.get('/tareas/deleteTask/1/p')
                    .end((err, res, body) => {
                        expect(res).to.have.status(200);
                    });
            });
    });

});