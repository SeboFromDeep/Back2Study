"use strict";

const express = require("express");

const routerUsers = express.Router();

const multer = require("multer"); // npm install multer --save
const controllerU = require("../controller/userController");
const cU = new controllerU();
const multerFactory = multer({ storage: multer.memoryStorage() });

//Validar npm install express-validator --save
const { check, validationResult } = require("express-validator"); // https://www.youtube.com/watch?v=hBETsBY3Hlg

routerUsers.post("/login_user", 
                multerFactory.none(), 
                cU.login);



module.exports = routerUsers;