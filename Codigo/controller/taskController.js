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
  
    getListTareas(request, response){

        daoTareas.listaTareas(request.session.id_)
        .then(value =>{
            
            response.render("principal", {
                title: "", 
                nameUser: request.session.userName, 
                mailUser: request.session.mail,
                tareas: value?value:0 //Evaluamos si hay tareas y mandamos a la vista
            });
        })
        .catch(error =>{  response.status(500);  });
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
    

    //REVISAR LOS RENDER
    addTareaProgramada(request, response){
        const errors = validationResult(request);
        console.log(errors);
        if(errors.isEmpty()){
            console.log("Añadiendo la tarea " + request.body.nombre +  " a la BBDD");
            // inicializamos el objeto de tarea
            request.body.category = request.body.categoria.toUpperCase();
            request.body.tipo = request.body.tipo.toUpperCase();
            let tareaProgramada = createObjectFromRequest(request);
            
            daoTareas.addTaskProgram(tareaProgramada)
            .then(tarea => {
                if(tarea)   response.redirect("/tareas/taskDetalisBy/"+tarea+"/p");
                else response.render("add-scheduled-task", createResponseLocals(false, "Error en la creación de la tarea"));
            })
            .catch( error =>{
                response.status(500);
                response.render("add-scheduled-task", createResponseLocals(false, "Error en la creación de la tarea"));
            });
        }
        else{
            console.log("errorfecha")
            response.status(200);
            response.render("add-scheduled-task", {
                nameUser: request.session.userName,
                errors: errors.mapped()
        });
        }
    }

    renderAddScheduledTask(request, response){
        response.status(200);
        response.render("add-scheduled-task", {
                        nameUser: request.session.userName,
                        errors: undefined
        });
    }


    

    getTask(request, response){
        console.log("obteniendo detalles de tarea "+ request.params.id+ " "+ request.params.tipo);
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
                                fecha: tareaManual[0].fechafin,
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
                        tareaP: tareaProgramada
                    });
           })
           .catch(error => {    response.status(500);      })
        }
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

               daoTareas.registroProgramada(cb_insert, tareaProgramada)
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

               daoTareas.consultarTarea(cb_consultarTarea, tareaManual);

                function cb_consultarTarea(err, num_tareas){
                    if (err) {
                        response.status(500);
                    } else {
                        if (num_tareas == 0) {
                           daoTareas.registroManual(cb_insert, tareaManual)
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

                 //cambios a partir de aqui paradaoTareas
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