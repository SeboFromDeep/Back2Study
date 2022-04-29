"use strict";

const config = require("../js/config");
const mysql = require("mysql");

const pool = mysql.createPool(config.databaseConfig);
const taskDao = require('../js/taskDAO');
const daoTareas = new taskDao(pool);
const _ = require('underscore');
const moment = require('moment');
const fecha = moment();
let events = require("../modules/event-module.js"); 
// events.Init();
const { createResponseLocals, createObjectFromRequest, fixObject } = require("./controllerUtils")

//Validar
const { check, validationResult } = require("express-validator");
class controllerTareas {
  
    getListTareas(request, response){

        daoTareas.listaTareas(request.session.id_)
        .then(tareas =>{
            // tareas.array.forEach(element => {
            //     console.log(element);
            // });

            response.render("principal", {
                            title: "", 
                            nameUser: request.session.userName, 
                            mailUser: request.session.mail,
                            tareas: tareas?tareas:0,
                            deleteId: false 
            });
        })
        .catch(error =>{  response.status(500);  });
    }

    
    updateCalendar(request, response){
        console.log("NEW CALENDAR REQUEST")//, request)
        let userEvents = events.UserEvents[request.session.userName]
        console.log("UserEvents:", events.UserEvents)
        if (userEvents == undefined) {
            console.log("UserEvents are undefined. Initializing empty array.")
            userEvents = []; //events.DefaultEvents;
            events.UserEvents[request.session.userName] = userEvents;
        }
        response.json(userEvents);
    }

    getCalendar(request, response){
        daoTareas.listaTareas(request.session.id_)
        .then(tareas =>{
            
            if (tareas != false) {
                events.UserEvents[request.session.userName] = events.CreateEventsFromTasks(tareas);
            }
            
            response.render("calendar", {
                title: "", 
                nameUser: request.session.userName, 
                mailUser: request.session.mail
                });
        })
        .catch(error => { response.status(500); });
    }


    //Cambiar para promesas
    addTareaManual(request, response) {
        const errors = validationResult(request);
        if(request.body.categoria.includes(" ")){
            response.status(200);
                response.render("addManualtask", {
                    nameUser: request.session.userName,
                    errors: undefined,
                    msg: "Formato de etiquetas incorrecto"
                });
        }
        else{
            if(errors.isEmpty()){
                let tareaPadre = {
                    nombre : request.body.nombre,
                    fechaIni : request.body.fechaIni,
                    fechaFin : request.body.fechaFin,
                    prioridad : request.body.prioridad,
                    categoria : request.body.categoria.toUpperCase()
                }
                //Tratamos las distintas configuraciones para hacer el insert
                let aux = fixObject(request.body, 6, 4);
                let tareas =aux.tasks;
                daoTareas.addTaskManual(tareaPadre, tareas, request.session.id_)
                .then(tareaManualId => {
                    if(tareaManualId)   response.redirect("/tareas/taskDetalisBy/"+tareaManualId+"/m");
                    else {
                        response.render("addManualtask", {
                            nameUser: request.session.userName,
                            errors: undefined,
                            msg: "Tarea Manual no introducida"
                        });
                    }
                })
                .catch( error =>{
                    response.status(500);
                    console.log("ERROR GARRAFAL");
                    // response.render("add-scheduled-task", createResponseLocals(false, "Error en la creación de la tarea"));
                });
            }
            else{
                response.status(200);
                response.render("addManualtask", {
                    nameUser: request.session.userName,
                    errors: errors.mapped()
                });
            }
        }
    }
    
    

    //REVISAR LOS RENDER!
    addTareaProgramada(request, response){
        const errors = validationResult(request);
        if(request.body.categoria.includes(" ")){
            response.status(200);
                response.render("add-scheduled-task", {
                                nameUser: request.session.userName,
                                errors: undefined,
                                msg: "Formato de etiquetas incorrecto"
                });
        }
        else{
            if(errors.isEmpty()){
                console.log("Añadiendo la tarea " + request.body.nombre +  " a la BBDD");
                // inicializamos el objeto de tarea
                request.body.category = request.body.categoria.toUpperCase();
                request.body.tipo = request.body.tipo.toUpperCase();
                let tareaProgramada = createObjectFromRequest(request);
                
                daoTareas.addTaskProgram(tareaProgramada)
                .then(tareaId => {
                    if(tareaId)   response.redirect("/tareas/taskDetalisBy/"+tareaId+"/p");
                    else response.render("add-scheduled-task", {
                                        nameUser: request.session.userName,
                                        errors: undefined,
                                        msg: "Tarea no creada correctamente"
                    });
                })
                .catch( error =>{
                    response.status(500);
                    response.render("add-scheduled-task", {
                                        nameUser: request.session.userName,
                                        errors: undefined,
                                        msg: "Tarea no creada correctamente"
                    });
                });
            }
            else{
                response.status(200);
                response.render("add-scheduled-task", {
                    nameUser: request.session.userName,
                    errors: errors.mapped(),
                    msg: undefined
                });
            }
        }
    }

    renderAddScheduledTask(request, response){
        response.status(200);
        response.render("add-scheduled-task", {
                        nameUser: request.session.userName,
                        errors: undefined,
                        msg: undefined
        });
    }

    renderAddManualTask(request, response){
        response.status(200);
        response.render("addManualTask", {
                        nameUser: request.session.userName,
        });
    }

    getTask(request, response){
        console.log("obteniendo detalles de tarea "+ request.params.id+ " "+ request.params.tipo);
        moment.locale("es");
        if(request.params.tipo == "m"){
            daoTareas.getDetailsTaskManual( request.session.id_, request.params.id)
            .then(tareaManual => {
                let tarea_m = createObjectFromRequest(request);
                console.log("Tarea Manual object");
                console.log(tarea_m);
                        response.render("verTareaManual",{
                                title: "Tarea", 
                                nameUser: request.session.userName, 
                                mailUser: request.session.mail,
                                idTarea: request.params.id,
                                nombre: tareaManual[0].nombre,
                                prioridad: tareaManual[0].prioridad, 
                                fechaIni: tareaManual[0].fechaini,
                                fechaFin: tareaManual[0].fechafin,
                                tiempoRest: moment(tareaManual[0].fechafin).fromNow(),
                                cat: tareaManual[0].categoria,
                                tareaM: tareaManual
                        });
                        
            })
            .catch(error => {    response.status(500);      })
            
        }
        else if(request.params.tipo = "p"){
           daoTareas.getDetailsTaskProgram( request.session.id_, request.params.id)
           .then(tareaProgramada => {
                    console.log("TAREA PROGRAMADA");
                    
                    
                    console.log(tareaProgramada);
                    response.render("verTareaProgramada",{
                        title: "Tarea Programada", 
                        nameUser: request.session.userName, 
                        mailUser: request.session.mail,
                        idTarea: request.params.id,
                        tiempoRest: moment(tareaProgramada[0].fechafin).fromNow(),
                        tareaP: tareaProgramada
                    });
           })
           .catch(error => {    response.status(500);      })
        }
    }

    getListByName(request, response){

        daoTareas.buscarTareaPorNombre(request.body.nombreBuscar, request.session.id_)
        .then(value =>{
            
            response.render("principal", {
                title: "", 
                nameUser: request.session.userName, 
                mailUser: request.session.mail,
                tareas: value?value:0, //Evaluamos si hay tareas y mandamos a la vista
                deleteId: false 
            });
        })
        .catch(error =>{  response.status(500);  });
    }

    getListByTag(request, response){

        daoTareas.buscarTareasporCategoria(request.params.tag, request.session.id_)
        .then(value =>{
            
            response.render("principal", {
                title: "", 
                nameUser: request.session.userName, 
                mailUser: request.session.mail,
                tareas: value?value:0, //Evaluamos si hay tareas y mandamos a la vista
                deleteId: false 
            });
        })
        .catch(error =>{  response.status(500);  });
    }

    /**
     * Borra una tarea especifica seleccionada por el usuario (el usuario vera nombres y horarios, pero internamente trabajamos con id)
     * @param {Object[]} request - Contiene el ID de la Tarea en .body
     * @param {Object[]} response - 
     * @returns {Promise} - Devuelve una cadena de promesas que comienza en el DAO de Tareas
     */
    borrarTarea(request, response) {
        
        daoTareas.deleteTask(request.session.id_, request.params.id)
        .then(tareaBorrada =>{
            console.log("tareaBorrada. "+tareaBorrada);
            // console.log(createResponseLocals(true, "Tarea ", request.params.id, " borrada con exito"));
            // response.render("borrar_tarea", createResponseLocals(true, "Tarea ", request.params.id, " borrada con exito"));
            
            response.render("principal", {
                title: "", 
                nameUser: request.session.userName, 
                mailUser: request.session.mail,
                tareas: undefined,
                deleteId: request.params.id //Evaluamos si hay tareas y mandamos a la vista
            });
        })
        .catch(function(error) {
                //Hacer este render
                console.log("Error Borrar Tarea: ", error)
                response.status(500);
                response.render("borrar_tarea", createResponseLocals(false, error));  
        })
    }
}

module.exports = controllerTareas;
