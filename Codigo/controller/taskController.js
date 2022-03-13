"use strict";


const config =require("../js/config");
const mysql = require("mysql");

const pool = mysql.createPool(config.databaseConfig);
const DaoTask = require('../js/taskDAO');
const tareas = new DaoTask(pool);

const moment = require('moment');
const fecha = moment();
//Validar
const { check, validationResult } = require("express-validator");

class controllerT{

    getTareas(request, response){

        tareas.listaTareas(cb_listaTareas, request.session.id_);
        
        function cb_listaTareas(err, tareas){
            if(err){
                
                response.status(500);
               
            }
            else{
                if(tareas){
                    
                    // response.render("preguntas", {
                    //     consult: "Todas las Preguntas",
                    //     nameUser: request.session.userName,
                    //     imageUser: request.session.mailID, 
                    //     preguntas: preguntas
                    // });
                    response.render("principal",{
                        title: "Inicio de sesión realizado con éxito", 
                        nameUser: request.session.userName, 
                        mailUser: request.session.mail,
                        tareas: tareas
                    })
                    console.log(tareas);
                }
            }
        }
    }

    

    
}

module.exports = controllerT;