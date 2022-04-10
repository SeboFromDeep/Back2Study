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
        if (request.session.id_!== undefined && request.session.mail !== undefined && request.session.userName !== undefined ) {
            response.locals.id_ = request.session.currentId;
            response.locals.mail = request.session.currentUser;
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
                        tipoAlert: "alert-danger",
                        errores: errors.mapped()});
            } 
            else {         
                
                if(!datosUsuario){
                    response.status(200);
                    response.render("login", {  title: "Error", 
                                                msgRegistro: "Error en usuario o contraseña", 
                                                tipoAlert: "alert-danger",
                                                errores: errors.mapped()});
                }
                else{

                    request.session.id_=datosUsuario.id;
                    request.session.mail = datosUsuario.email;
                    request.session.userName = datosUsuario.username;

                    response.locals.id_=request.session.id_;
                    response.locals.mailID = request.session.mailID;
                    response.locals.userName = request.session.userName;

                    console.log("DATOS controller: "+datosUsuario.id+"/"+datosUsuario.username+"/"+datosUsuario.email+"/"+datosUsuario.password);
                    response.render("principal", {  
                                                title: "Inicio de sesión realizado con éxito", 
                                                nameUser: request.session.userName, 
                                                mailUser: request.session.mail,
                                                tareas: undefined });
                }
                
            }
        }
    }



    cierreSesion(request, response){
        response.status(200);
        request.session.destroy();
        response.redirect("/");
    }

    probando(request, response){
        response.status(200);
        response.render("principal", {  
            title: "Inicio de sesión realizado con éxito", 
            nameUser: request.session.userName, 
            mailUser: request.session.mail,
            tareas: undefined });
    }

    probando2(request, response){
        response.status(200);
        response.render("principal2", {  
            title: "Inicio de sesión realizado con éxito", 
            nameUser: request.session.userName, 
            mailUser: request.session.mail });
        
    }

    registroUsu(request, response)  {
        //console.log("CONTROLADOR registro "+request.body.correo+" "+request.body.password);
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            console.log("SIN ERRORES");
            
            //creamos el usuario con los datos del formulario
            let usuario = {
                correo: request.body.correo,
                nombre: request.body.username,
                pass: request.body.password,
                pass2: request.body.password2,
            };

            users.existeUsuario(usuario)
            .then(value => {
                console.log("1: " + value);
                if (value == false) return users.existeCorreo(usuario);
                else throw "Nombre de Usuario no disponible";
            })
            .then(value => {
                console.log("2: " + value);
                if (value == false) return users.registro(usuario);
                else throw "Ya existe un usuario con ese correo";
            })
            .then(value => {
                console.log("3: " + value);
                if (value == true){
                    console.log("Registro exitoso.")
                    response.render("login", {  
                                    title: "Registro completado", 
                                    msgRegistro: "Registro completado " + usuario.nombre + ". Ya puedes loguearte.", 
                                    tipoAlert: "alert-success",
                                    errores: errors.mapped()
                    });
                }
                else throw value;
            })
            .catch(error => {
                response.status(500);
                response.render("signup", {     
                                title: "¡Registro erroneo!",
                                errores: error, 
                                //msgRegistro: error
                });
            });
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