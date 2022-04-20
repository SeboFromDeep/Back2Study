"use strict";

const config = require("../js/config");
const mysql = require("mysql");

const pool = mysql.createPool(config.databaseConfig);
const taskDao = require('../js/taskDAO');
const daoTareas = new taskDao(pool);
const _ = require('underscore');
const moment = require('moment');
const fecha = moment();

const { createResponseLocals, createObjectFromRequest } = require("./controllerUtils")

//Validar
const { check, validationResult } = require("express-validator");
class controllerTareas {
  
    getListTareas(request, response){

        daoTareas.listaTareas(request.session.id_)
        .then(tareas =>{
            
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

    
    //Cambiar para promesas
    addTareaManual(request, response) {
        console.log("DATOS TAREA MANUAL");
        console.log(request.body);

        console.log("Num tareas: "+request.body.oculto);
        console.log("Tamaño: "+request.body.length);
        let tareaPadre = {
            nombre : request.body.nombre,
            fechaIni : request.body.fechaIni,
            fechaFin : request.body.fechaFin,
            prioridad : request.body.prioridad,
            categoria : request.body.categoria.toUpperCase()
        }
        //Tratamos las distintas configuraciones para hacer el insert
        let objectToFix = request.body;
        let initialLines = 6;
        let linesPerTask = 4;

        var newObject = { tasks: [] }
        var initialCount = initialLines // inicializamos el initialCount a lineas iniciales para saber cuando pasar a la fase de tareas
        var currentlyAddedTasks = 0 // cuantas tareas tiene el newObject incluidas actualmente 
        var tasksToAdd = parseInt(request.body.oculto) // las tareas que tiene el objectToFix
        var currentTaskLine = 0 // linea actual a procesar
        var currentTask // el objeto de la tarea actual que se esta procesando
        for (const key in objectToFix) {
            if (initialCount > 0) { // fase de lineas iniciales (copiamos las lineas tal cual)
                newObject[key] = objectToFix[key]
                initialCount--;
            } else { // fase de tareas (aqui procesamos todo linea a linea)
                let newVar = objectToFix[key] // cogemos el valor de la nueva linea a procesar
                if (currentTaskLine == 0) { // si empezamos en una linea nueva, creamos el objeto de la tarea que vamos a guardar
                    if (tasksToAdd == currentlyAddedTasks) return newObject;
                    currentTask = {}
                    newObject.tasks[currentlyAddedTasks] = currentTask // se incluye aqui, pero las tablas van por referencia, se pueden modificar mas adelante
                    currentlyAddedTasks++;
                    // si la currentTaskLine es 0, estamos procesando el dia
                    // aprovechamos y ya metemos aqui
                    let fixedVar = ""
                    for (const newKey in newVar) // vamos string por string concatenando con separador
                        fixedVar = fixedVar + newVar[newKey] + ",";
                    // actualizamos el valor de esa linea ya que lo hemos procesado
                    newVar = fixedVar.slice(0, -1); // quita la ultima coma del string (esto si fuera necesario formatear con un separador)
                }
                currentTask[key.replace(/\d+/g, '')] = newVar // ese replace quita los numeros del string para dejar solo "dia", etc
                currentTaskLine = (currentTaskLine+1)%linesPerTask; // 4 son las lineas por cada tarea
            }
            }
        let tareas = newObject.tasks;
        for (let i = 0; i < tareas.length; i++) {
            console.log(tareas[i].dia.replace(/(,)/gm,"")+" "+tareas[i].horaIni+" "+tareas[i].horaFin+" "+tareas[i].recursivo);
        }
        daoTareas.addTaskManual(tareaPadre, newObject.tasks, request.session.id_)
        .then(tareaManualId => {
            if(tareaManualId)   response.redirect("/tareas/taskDetalisBy/"+tareaManualId+"/m");
            else console.log("NO INTRODUCIDA");
        })
        .catch( error =>{
            response.status(500);
            console.log("ERROR GARRAFAL");
            // response.render("add-scheduled-task", createResponseLocals(false, "Error en la creación de la tarea"));
        });
    }
    
    

    //REVISAR LOS RENDER!
    addTareaProgramada(request, response){
        const errors = validationResult(request);
        if(errors.isEmpty()){
            console.log("Añadiendo la tarea " + request.body.nombre +  " a la BBDD");
            // inicializamos el objeto de tarea
            request.body.category = request.body.categoria.toUpperCase();
            request.body.tipo = request.body.tipo.toUpperCase();
            let tareaProgramada = createObjectFromRequest(request);
            
            daoTareas.addTaskProgram(tareaProgramada)
            .then(tareaId => {
                if(tareaId)   response.redirect("/tareas/taskDetalisBy/"+tareaId+"/p");
                else response.render("add-scheduled-task", createResponseLocals(false, "Error en la creación de la tarea"));
            })
            .catch( error =>{
                response.status(500);
                response.render("add-scheduled-task", createResponseLocals(false, "Error en la creación de la tarea"));
            });
        }
        else{
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
                                fecha: moment(tareaManual[0].fechafin).fromNow(),
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
                    
                    tareaProgramada[0].fechafin = moment(tareaProgramada[0].fechafin).fromNow();
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