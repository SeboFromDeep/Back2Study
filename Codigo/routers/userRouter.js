"use strict";

const express = require("express");

const routerUsers = express.Router();

const multer = require("multer"); // npm install multer --save
const controllerU = require("../controllers/userController");
const cU = new controllerU();
const multerFactory = multer({ storage: multer.memoryStorage() });

//Validar npm install express-validator --save
const { check, validationResult } = require("express-validator"); // https://www.youtube.com/watch?v=hBETsBY3Hlg

routerUsers.post("/login_user", 
                multerFactory.none(),
                cU.login);

// Cierre de sesion------------
routerUsers.get("/CloseSession", 
                cU.usuarioLogeado, 
                cU.cierreSesion);

routerUsers.get("/principal",
                cU.usuarioLogeado,
                cU.probando);

routerUsers.get("/prueba2",
                cU.usuarioLogeado,
                cU.probando2);

routerUsers.post("/registro_Usuario",
    multerFactory.none(),
    
    check("correo","Dirección de correo no válida o vacia").isEmail(),
    check("password", "La logintud minima debe ser 4").isLength({ min: 4}),
    check("password2", "La logintud minima debe ser 4")
    .isLength({ min: 4})
    .custom((value, { req }) => {
         if (value !== req.body.password) {
             throw new Error('Las contraseñas no son iguales');
         }
         return true;
     }),
    cU.registroUsu);

module.exports = routerUsers;