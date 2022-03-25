"use strict";

const express = require("express");

const taskRouter = express.Router();

const multer = require("multer");
const controllerU = require("../controller/userController");
const controllerUsuario = new controllerU();
const controllerT = require("../controller/taskController");
const controllerTareas = new controllerT();
const multerFactory = multer({ storage: multer.memoryStorage() });

//Validar
const { check, validationResult } = require("express-validator"); // https://www.youtube.com/watch?v=hBETsBY3Hlg

taskRouter.get("/taskList", controllerUsuario.usuarioLogeado, controllerTareas.listarTareas);

// Falta hacer el post de tarea manual
taskRouter.get("/tasks", controllerUsuario.usuarioLogeado, controllerTareas.añadirTareaManual);

taskRouter.get("/add_scheduled_task", controllerUsuario.usuarioLogeado, controllerTareas.renderAddScheduledTask);
taskRouter.post("/add_scheduled_task", 
    multerFactory.none(), 
    controllerTareas.addTareaProgramada)

module.exports = taskRouter;