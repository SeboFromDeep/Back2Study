"use strict";


const config =require("../js/config");
const mysql = require("mysql");

const pool = mysql.createPool(config.databaseConfig);

const DaoUsers = require('../js/userDAO');
const users =new DaoUsers(pool);

//Validar
const { check, validationResult } = require("express-validator");

class controllerU{

    // usuarioLogeado(request, response, next) {
    //     if (request.session.mailID !== undefined && request.session.userName !== undefined ) {
    //         response.locals.userEmail = request.session.currentUser;
    //         response.locals.userName = request.session.currentName;
            
    //         next();
    //     } else {
            
    //         response.redirect("/login");
    //     }
    // }

    login(request, response){
        console.log("CONTROLADOR "+request.body.correo+" "+request.body.password)
        users.login(request.body.correo, request.body.password, cb_isUser);
        
        function cb_isUser(err, datosUsuario){
            if (err) {
               
                response.status(500);
                response.render("login", {  
                        title: "Error", 
                        msgRegistro: "Error en el acceso a la base de datos", 
                        tipoAlert: "alert-danger"});
            } 
            else {         
                
                if(!datosUsuario){
                    response.status(200);
                    response.render("login", {  title: "Error", 
                                                msgRegistro: "Error en usuario o contraseña", 
                                                tipoAlert: "alert-danger"});
                }
                else{
                    //Variables de sesion correo(id) y nombre de usuario
                    request.session.mailID = request.body.correo;
                    request.session.userName = datosUsuario.nombre;

                    response.locals.mailID = request.session.mailID;
                    response.locals.userName = request.session.userName;
                    
                
                    response.render("principal", {
                        nameUser: request.session.userName,
                        imageUser: request.session.mailID, });
                }
                
            }
        }
    }

    // cierreSesion(request, response){
    //     response.status(200);
    //     request.session.destroy();
    //     response.redirect("/login");
    // }

    
}

module.exports = controllerU;