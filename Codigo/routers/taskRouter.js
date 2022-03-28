"use strict";

const express = require("express");

const taskRouter = express.Router();



const multer = require("multer");
const controllerU = require("../controller/userController");
const cU = new controllerU();
const controllerT = require("../controller/taskController");
const cT = new controllerT();
const multerFactory = multer({ storage: multer.memoryStorage() });

//Validar
const { check, validationResult } = require("express-validator"); // https://www.youtube.com/watch?v=hBETsBY3Hlg

taskRouter.get("/taskList", 
                cU.usuarioLogeado, 
                cT.getListTareas);

taskRouter.get("/taskDetalisBy/:id/:tipo/:nombre/:prioridad/:fecha/:cat", 
                cU.usuarioLogeado, 
                cT.getTask);

// taskRouter.get("/taskBy/:id", 
//                 cU.usuarioLogeado, 
//                 cT.getTask);//Busqueda por tag

module.exports = taskRouter;