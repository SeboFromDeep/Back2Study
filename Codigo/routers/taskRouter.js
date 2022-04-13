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

// Falta hacer el post de tarea manual
// taskRouter.get("/tasks", 
//                 controllerUsuario.usuarioLogeado, 
//                 controllerTareas.añadirTareaManual);

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
            controllerTareas.addTareaProgramada);

//Formulario Añadir Manual --> Tarea bbdd --> Mostrar Tarea
taskRouter.get("/addManualTask", 
            multerFactory.none(),
            controllerUsuario.usuarioLogeado,
            controllerTareas.renderAddManualTask);

// taskRouter.get("/taskDetalisBy/:id/:tipo/:nombre/:prioridad/:fecha/:cat", 
taskRouter.get("/taskDetalisBy/:id/:tipo", 
                controllerUsuario.usuarioLogeado, 
                controllerTareas.getTask);

// taskRouter.get("/taskBy/:id", 
//                 cU.usuarioLogeado, 
//                 cT.getTask);//Busqueda por tag

module.exports = taskRouter;