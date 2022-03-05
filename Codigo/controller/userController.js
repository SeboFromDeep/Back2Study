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


    registroUsu(request, response)  {
        console.log("CONTROLADOR registro "+request.body.correo+" "+request.body.password);
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            console.log("SIN ERRORES");
            
        //         let usuario = {
        //             correo: request.body.correo,
        //             nombre: request.body.nombre,
        //             pass: request.body.passw,
        //             pass2: request.body.passw2,
        //             imagen: null
        //         };
            
        //         if (request.file.originalname) {
        //             // console.log(request.file.originalname);//Nombre archivo
        //             // console.log("<<<<<<<<<<<<<<<<<<<<<");
        //             // console.log(request.file.buffer);//archivo binario
        //             usuario.imagen= request.file.buffer;
        //         }
        //         else{//Hacer random de imagen
        //             // console.log(request.file);
        //             // console.log("SIN IMAGEN");
        //         }
        //         // console.log("Datos usuario antes DAO: "+usuario.correo+" "+usuario.nombre+" "+usuario.pass+" "+usuario.pass2); 
        //         //let users =new DaoUsers(pool);
        //         users.insert(usuario, cb_insert);
                
        //         function cb_insert(err, newId){
        //             if (err) {
        //                 //console.log(err.message);
        //                 response.status(500);
        //                 response.render("registro", {   title: "¡Registro erroneo!",
        //                                                 errores: errors.mapped(), 
        //                                                 msgRegistro: true});
        //             } 
        //             else {
        //                 // console.log("usuario registrado-->: "+newId);
        //                 response.render("login", {  title: "¡Registro completado!", 
        //                                             msgRegistro: "¡Registro completado! Puede Logearse. "+newId, 
        //                                             tipoAlert: "alert-success"});
        //             }
        //         }
            
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