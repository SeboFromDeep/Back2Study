"use strict";

const express = require("express");

const taskRouter = express.Router();

const multer = require("multer");
const controllerUsuario = new (require("../controller/userController"))();
const controllerTareas = new (require("../controller/taskController"))();
const multerFactory = multer({ storage: multer.memoryStorage() });

//Validar
const { check, validationResult } = require("express-validator"); // https://www.youtube.com/watch?v=hBETsBY3Hlg

taskRouter.get("/taskList", 
                controllerUsuario.usuarioLogeado, 
                controllerTareas.getListTareas);


taskRouter.get("/calendar-events", 
                controllerUsuario.usuarioLogeado, 
                controllerTareas.updateCalendar);            

taskRouter.get("/calendario", 
                controllerUsuario.usuarioLogeado, 
                controllerTareas.getCalendar); 

//Menu --> Formulario Añadir Tarea Programada
taskRouter.get("/addManualTask", 
                controllerUsuario.usuarioLogeado, 
                controllerTareas.renderAddManualTask);

//Menu --> Formulario Añadir Tarea Programada
taskRouter.get("/add_scheduled_task", 
                controllerUsuario.usuarioLogeado, 
                controllerTareas.renderAddScheduledTask);

//Formulario Añadir Tarea Programada --> Tarea bbdd --> Mostrar Tarea
taskRouter.post("/add_scheduled_task", 
            multerFactory.none(),
            controllerUsuario.usuarioLogeado,

            check("nombre", "Nombre de tarea no válido.").isLength({min: 1, max: undefined}),
            check("prioridad")
            .custom(
                (value, {req}) => {
                    if (value != null) return true;
                    else throw Error("Por favor escoge una prioridad para la tarea.");
                }),
            check("tipo")
            .custom((value, {req}) => {
                    if (value == "DIARIA" || value == "SEMANAL") return true;
                    else throw Error("Por favor indica el tipo de la tarea.");
                }
            ),
            check("horas", "El número de horas debe de ser mayor que 0.").isInt({gt: 0}),
            check("fechaIni", "Fecha de inicio no válida.").isAfter(),
            check("fechaFin")
            .custom((value, {req}) => {
                if (value > req.body.fechaIni) return true;
                else throw Error("Fecha de finalización no válida.");
            }),
            controllerTareas.addTareaProgramada);

//Formulario Añadir Manual --> Tarea bbdd --> Mostrar Tarea
taskRouter.get("/addManualTask", 
            multerFactory.none(),
            controllerUsuario.usuarioLogeado,
            controllerTareas.renderAddManualTask);

taskRouter.post("/addManualTask", 
            multerFactory.none(),
            controllerUsuario.usuarioLogeado,
            check("nombre", "Nombre de tarea no válido.").isLength({min: 1, max: undefined}),
            check("prioridad")
            .custom(
                (value, {req}) => {
                    if (value != null) return true;
                    else throw Error("Por favor escoge una prioridad para la tarea.");
                }),
            check("fechaIni", "Fecha de inicio no válida.").isAfter(),
            check("fechaFin")
            .custom((value, {req}) => {
                if (value > req.body.fechaIni) return true;
                else throw Error("Fecha de finalización no válida.");
            }),
            controllerTareas.addTareaManual);

// taskRouter.get("/taskDetalisBy/:id/:tipo/:nombre/:prioridad/:fecha/:cat", 
taskRouter.get("/taskDetalisBy/:id/:tipo", 
                controllerUsuario.usuarioLogeado, 
                controllerTareas.getTask);

//Borrar Tarea 
taskRouter.get("/deleteTask/:id/:tipo", 
                controllerUsuario.usuarioLogeado, 
                controllerTareas.borrarTarea);

taskRouter.post("/listarPorNombre", 
                multerFactory.none(),
                controllerUsuario.usuarioLogeado, 
                controllerTareas.getListByName);

taskRouter.get("/porTag/:tag",
                multerFactory.none(), 
                controllerUsuario.usuarioLogeado, 
                controllerTareas.getListByTag);

module.exports = taskRouter;