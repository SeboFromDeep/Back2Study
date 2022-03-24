"use strict";

const config = require("../js/config");
const mysql = require("mysql");

const pool = mysql.createPool(config.databaseConfig);
const taskDao = require('../js/taskDAO');
const daoTareas = new taskDao(pool);

const moment = require('moment');
const fecha = moment();

const { createResponseLocals, createObjectFromRequest } = require("./controllerUtils")

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
        console.log("Añadiendo la tarea manual " + request.body.nombre + " a la BBDD");

        function añadirTareaManualCallback(err, result) {
            if (err){
                response.render("add_tarea_manual", createResponseLocals(false, "Error: creación de tarea manual en BBDD fallida"));   
            }
            else {
                if (result) {
                    response.render("listar_tareas", createResponseLocals(true, "Exito: tarea manual añadida"));
                } else {
                    response.render("add_tarea_manual", createResponseLocals(false, "Error: tarea manual es null"));
                }
            }
        }   
        
        function franjaHorariaCallback(err, franjaDisponible) {
            if (err) {
                response.status(500);
                response.render("add_tarea_manual", createResponseLocals(false, "Error: no se pudo consultar la franja horaria en la BBDD"));   
            }
            else {
                if (franjaDisponible) {
                    console.log("La franja horaria esta disponible");
                    request.body.category = request.body.categoria.toUpperCase()
                    daoTareas.añadirTareas(añadirTareaManualCallback, createObjectFromRequest(request));
                }
                else {
                    response.status(500);
                    response.render("add_tarea_manual", createResponseLocals(false, "Error: franja horaria no disponible"));   
                }
            }
        } 

        // comprobar que no haya tareas en la franja proporcionada
        // el dao automaticamente llamara a la funcion del DAO de añadir tareas si todo va bien
        daoTareas.consultarTareasEnFranjaHoraria(franjaHorariaCallback, request.body.fechaIni, request.body.fechaFin);
    }
      
    addTareaProgramada(request, response){
        console.log("Añadiendo la tarea " + request.body.nombre +  " a la BBDD");
        
        // inicializamos el objeto de tarea
        request.body.category = request.body.categoria.toUpperCase()
        request.body.tipo = request.body.tipo.toUpperCase()
        let tareaProgramada = createObjectFromRequest(request);

        // aquí planearíamos la tarea llamando al algoritmo de ordenación

        function añadirTareaProgramadaCallback(errors, result){
            if (errors){
                //render y mssg pueden cambiar de nombre 
                response.render("add_tarea_programada", createResponseLocals(false, "Error en la creación de la tarea"));
            }
            else {
                if (result) {
                    response.render("listar_tareas", createResponseLocals(true, "Tarea Programada añadida"));
                }
                else { 
                    response.render("add_tarea_programada", createResponseLocals(false, "Error en la creación de la tarea"));
                }
            }
        }

        // añadimos la tarea a la BBDD
        tareas.añadirTareaProgramada(tareaProgramada, añadirTareaProgramadaCallback);
    }
}

module.exports = controllerTareas;

 /*
    @Alex
    añadirTareas(request, response) {
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            console.log("SIN ERRORES");          
            if (request.body.tipo=='programada') {
                let tareaProgramada = {
                    nombre: request.body.nombre,
                    prioridad: request.body.prioridad,
                    categoria: request.body.categoria,
                    usuario: request.session.currentId,
                    fechaFin: request.body.fechaFin,
                    fechaIni: request.body.fechaIni,

                    //estos son los atributos de programada
                    horasDia: request.body.horasDia,
                    horasSemana: request.body.horasSemana
                };
                //ejecutamos la función registro de el DAO, y después se ejecuta cb_insert
                //Aqui consultaríamos antes el primer hueco dispoible...

                tareas.registroProgramada(cb_insert, tareaProgramada)
            } else {
                let tareaManual = {
                    nombre: request.body.nombre,
                    prioridad: request.body.prioridad,
                    categoria: request.body.categoria,
                    usuario: request.session.currentId,
                    fechaFin: request.body.fechaFin,
                    fechaIni: request.body.fechaIni,
                    horaIni: request.body.horaIni,
                    horaFin: request.body.horaFin,
                    recurrente: request.body.recurrente,
                    diasRecurrentes: request.body.diasRecurrentes,
                };

                tareas.consultarTarea(cb_consultarTarea, tareaManual);

                function cb_consultarTarea(err, num_tareas){
                    if (err) {
                        response.status(500);
                    } else {
                        if (num_tareas == 0) {
                            tareas.registroManual(cb_insert, tareaManual)
                        }
                        else {
                            //Lanzar error
                        }
                    }
                }
            }
              
            function cb_insert(err, completed) {
                if (err) {
                    //console.log(err.message);
                    response.status(500);
                    response.render("Añadir tarea", {   
                        title: "¡Tarea erronea!",
                        errores: errors.mapped(), 
                        msgRegistro: "Error al añadir tarea"});
                    } 

                 //cambios a partir de aqui para tareas.
                else {
                    if (completed) {
                        console.log("Registro exitoso.")
                        response.render("login", {  
                            title: "Registro completado", 
                            msgRegistro: "Registro completado " + usuario.nombre + ". Ya puedes loguearte.", 
                            tipoAlert: "alert-success"});
                    } else {
                        let msg = "El usuario o correo ya existen.";
                        console.log(msg);
                        response.render("signup", {   
                            title: "¡Registro erroneo Usu!",
                            errores: errors.mapped(), 
                                                          msgRegistro: msg});
                      }
                      
                }
            }
              
        } 
    else {
        console.log("ERRORES!");
        response.render("signup", {
            title: "¡Hay Errores!", 
            errores: errors.mapped(), 
            msgRegistro: false});
        }
    }*/