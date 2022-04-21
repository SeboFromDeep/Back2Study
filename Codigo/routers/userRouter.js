"use strict";

const express = require("express");

const routerUsers = express.Router();

const multer = require("multer"); // npm install multer --save
const controllerUsuario = new (require("../controller/userController"))();
const multerFactory = multer({ storage: multer.memoryStorage() });

//Validar npm install express-validator --save
const { check, validationResult } = require("express-validator"); // https://www.youtube.com/watch?v=hBETsBY3Hlg

routerUsers.post("/login_user", 
                multerFactory.none(),
                
                controllerUsuario.login);

// Cierre de sesion------------
routerUsers.get("/CloseSession", 
                controllerUsuario.usuarioLogeado, 
                controllerUsuario.cierreSesion);

routerUsers.get("/principal",
                controllerUsuario.usuarioLogeado,
                controllerUsuario.probando);

routerUsers.get("/prueba2",
                controllerUsuario.usuarioLogeado,
                controllerUsuario.probando2);

routerUsers.post("/registro_Usuario",
    multerFactory.none(),
    
    check("correo","Dirección de correo no válida o vacia").isEmail(),
    check("password", "La logintud minima debe ser 4").isLength({ min: 4}),
    check("password2")
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales');
        }
        return true;
    }),
    controllerUsuario.registroUsu);

    routerUsers.post("/forgot_password",
        multerFactory.none(),
        controllerUsuario.sendEmail
        //res.send(email);
    );

    routerUsers.get("/reset-password/:id/:token",
        // multerFactory.none(),
        controllerUsuario.renderChangePassword
        //res.send(email);
    );

    

    routerUsers.post("/change_password",
        multerFactory.none(),
        check("pass1", "La logintud minima debe ser 4").isLength({ min: 4}),
        check("pass2")
        .custom((value, { req }) => {
            if (value !== req.body.pass1) {
                throw new Error('Las contraseñas no son iguales');
            }
            return true;
        }),
        controllerUsuario.changeEmail
        //res.send(email);
    );

module.exports = routerUsers;