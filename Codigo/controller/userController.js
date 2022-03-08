"use strict";


const config =require("../js/config");
const mysql = require("mysql");

const pool = mysql.createPool(config.databaseConfig);

const DaoUsers = require('../js/userDAO');
const users =new DaoUsers(pool);

//Validar
const { check, validationResult } = require("express-validator");

class controllerU{

    usuarioLogeado(request, response, next) {
        if (request.session.mailID !== undefined && request.session.userName !== undefined ) {
            response.locals.userEmail = request.session.currentUser;
            response.locals.userName = request.session.currentName;
            
            next();
        } else {
            
            response.redirect("/login");
        }
    }

    login(request, response){
        console.log("CONTROLADOR "+request.body.correo+" "+request.body.password);
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

                    request.session.mailID = request.body.correo;
                    request.session.userName = datosUsuario.nombre;

                    response.locals.mailID = request.session.mailID;
                    response.locals.userName = request.session.userName;
                    console.log("NOMBRE USUARIO: "+datosUsuario.nombre);

                    response.render("principal", {
                        nameUser: request.session.mailID });
                    
                }
                
            }
        }
    }



    cierreSesion(request, response){
        response.status(200);
        request.session.destroy();
        response.redirect("/");
    }


    registroUsu(request, response)  {
        console.log("CONTROLADOR registro "+request.body.correo+" "+request.body.password);
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            console.log("SIN ERRORES");
            
            let usuario = {
                correo: request.body.correo,
                nombre: request.body.username,
                pass: request.body.password,
                pass2: request.body.password2,
                imagen: null
            };
        
            users.registro(usuario, cb_insert);
            
            function cb_insert(err, newId){
                if (err) {
                    //console.log(err.message);
                    response.status(500);
                    response.render("registro", {   title: "¡Registro erroneo!",
                                                    errores: errors.mapped(), 
                                                    msgRegistro: true});
                } 
                else {
                    // console.log("usuario registrado-->: "+newId);
                    response.render("login", {  title: "Registro completado", 
                                                msgRegistro: "Registro completado" +". Ya puedes loguearte " + newId, 
                                                tipoAlert: "alert-success"});
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

module.exports = controllerU;