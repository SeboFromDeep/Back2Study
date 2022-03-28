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

    getListTareas(request, response){

        tareas.listaTareas(cb_listaTareas, request.session.id_);
        
        function cb_listaTareas(err, tareas){
            if(err){
                
                response.status(500);
               
            }
            else{
                if(tareas){
                    // console.log(tareas[0].tipo);
                    // response.render("preguntas", {
                    //     consult: "Todas las Preguntas",
                    //     nameUser: request.session.userName,
                    //     imageUser: request.session.mailID, 
                    //     preguntas: preguntas
                    // });
                    // tareas.listarTareasEspecifica(cb_listaTareasESP, tareas[0].tipo);
                    // function cb_listaTareasESP(err, tab){
                    //     if(err){
                
                    //         response.status(500);
                           
                    //     }
                    //     else{
                            
                    //     }
                    // }
                    response.render("principal",{
                        title: "Inicio de sesión realizado con éxito", 
                        nameUser: request.session.userName, 
                        mailUser: request.session.mail,
                        tareas: tareas
                    });

                    // console.log(tareas);
                    
                }
            }
        }
    }

    getTask(request, response){
        console.log("obteniendo detalles de tarea "+ request.params.id+ " "+ request.params.tipo+ " "+ request.params.nombre+ " "+ request.params.prioridad+ " "+ request.params.fecha+ " "+ request.params.cat );
        if(request.params.tipo == "m"){
            tareas.getDetailsTaskManual( request.session.id_, request.params.id, request.params.tipo, cb_verTareaM);
            function cb_verTareaM(err, tarea_M){
                if(err){
                    
                    response.status(500);
                   
                }
                else{
                    response.render("verTareaManual",{
                        title: "Tarea", 
                        nameUser: request.session.userName, 
                        mailUser: request.session.mail,
                        idTarea: request.params.id,
                        nombre: request.params.nombre,
                        prioridad: request.params.prioridad, 
                        fecha: request.params.fecha,
                        cat: request.params.cat,
                        tareaM: tarea_M
                    });
                    console.log(tarea_M);
                }
            }
        }
        else if(request.params.tipo = "p"){
            tareas.getDetailsTaskProgram( request.session.id_, request.params.id, request.params.tipo, cb_verTareaP);
            function cb_verTareaP(err, tarea_P){
                if(err){
                    
                    response.status(500);
                   
                }
                else{
                    console.log("TAREA PROGRAMADA");
                    console.log(tarea_P);
                    response.render("verTareaProgramada",{
                        title: "Tarea Programada", 
                        nameUser: request.session.userName, 
                        mailUser: request.session.mail,
                        idTarea: request.params.id,
                        nombre: request.params.nombre,
                        prioridad: request.params.prioridad, 
                        fecha: request.params.fecha,
                        cat: request.params.cat,
                        tareaP: tarea_P
                    });
                }
            }
        }
        

        
    }



    

    
}

module.exports = controllerT;