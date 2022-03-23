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

    createTareas(request, response)
    {
          
          const errors = validationResult(request);
          if (errors.isEmpty()) {
              console.log("SIN ERRORES");
            
           
            if(request.tipo=='programada')
            {

                
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
              
            }

            else{

              
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
                    if(err){
                        
                        response.status(500);
                       
                    }
                    else{

                        if(num_tareas==0){
                            
                            tareas.registroManual(cb_insert, tareaManual)
                        }
                        else{
                            //Lanzar error
                        }
                            
                    }
                }
              
            }
              
            function cb_insert(err, completed){
                  if (err) {
                      //console.log(err.message);
                      response.status(500);
                      let msg= "Error al añadir tarea";
                      response.render("Añadir tarea", {   title: "¡Tarea erronea!",
                                                      errores: errors.mapped(), 
                                                      msgRegistro: msg});
                  } 

                  //cambios a partir de aqui para tareas.
                  else {
                      if(completed){
                          console.log("Registro exitoso.")
                          response.render("login", {  title: "Registro completado", 
                                                  msgRegistro: "Registro completado " + usuario.nombre + ". Ya puedes loguearte.", 
                                                  tipoAlert: "alert-success"});
                      }
                      else{
                          let msg= "El usuario o correo ya existen.";
                          console.log(msg);
                          response.render("signup", {   title: "¡Registro erroneo Usu!",
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
      }
}

module.exports = controllerT;