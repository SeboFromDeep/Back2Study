"use strict";

const config = require("../js/config");
const mysql = require("mysql");

const pool = mysql.createPool(config.databaseConfig);
const taskDao = require('../js/taskDAO');
const daoTareas = new taskDao(pool);

const moment = require('moment');
const fecha = moment();

//Validar
const { check, validationResult } = require("express-validator");

class controllerTareas {

    listarTareas(request, response) {

        function listarTareasCallback(err, tareas) {
            if (err) {
                response.status(500);
            }
            else {
                if (tareas) {
                    
                    // response.render("preguntas", {
                    //     consult: "Todas las Preguntas",
                    //     nameUser: request.session.userName,
                    //     imageUser: request.session.mailID, 
                    //     preguntas: preguntas
                    // });
                    response.render("principal", {
                        title: "Inicio de sesión realizado con éxito", 
                        nameUser: request.session.userName, 
                        mailUser: request.session.mail,
                        tareas: tareas
                    })
                    console.log(tareas);
                }
            }
        }

        daoTareas.listaTareas(listarTareasCallback, request.session.id_);
    }

    añadirTareaManual(request, response) {

        function añadirTareaManualCallback(err, tarea) {
            if (err) {
                response.status(500);
            }
            else {
                if (tarea) {
                    console.log("Tarea Manual: ", tarea);
                    
                    request.session.id_ = tarea.id;
                    request.session.mail = tarea.email;
                    request.session.userName = tarea.username;

                    response.locals.id_ = tarea.id_;
                    response.locals.tarea = tarea;

                    response.render("añadirTareas", {
                        title: "Tarea Manual añadida con exito!", 
                        nameUser: request.session.userName, 
                        mailUser: request.session.mail,
                        tarea: tarea
                    })
                }
            }
        }

        daoTareas.añadirTareas(añadirTareaManualCallback, request.session.id_);
    }
}

module.exports = controllerTareas;