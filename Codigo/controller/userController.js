"use strict";


const config =require("../js/config");
const mysql = require("mysql");

const pool = mysql.createPool(config.databaseConfig);

const transporter = require("../js/mailer");    // para enviar correos
const jwt = require("jsonwebtoken");    // para crear un link
const JWT_SECRET = "supersecreto";  // esto habria que moverlo a otro sitio tal vez pero de momento funciona

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
            //ejecutamos la función registro de el DAO, y después se ejecuta cb_insert
            users.registro(usuario, cb_insert);
            
            function cb_insert(err, completed){
                if (err) {
                    //console.log(err.message);
                    response.status(500);
                    let msg= "Error de registro";
                    response.render("signup", {   title: "¡Registro erroneo!",
                                                    errores: errors.mapped(), 
                                                    msgRegistro: msg});
                } 
                else {
                    if(completed){
                        console.log("Registro exitoso.")
                        response.render("login", {  title: "Registro completado", 
                                                msgRegistro: "Registro completado " + usuario.nombre + ". Ya puedes loguearte.", 
                                                tipoAlert: "alert-success"});
                    }
                    else{
                        let msg= "El usuario o correo ya existen.";
                        console.log(msg);
                        response.render("signup", {   title: "¡Registro erroneo Usu!",
                                                        errores: errors.mapped(), 
                                                        msgRegistro: msg});
                    }
                    
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

    sendEmail(request, response){
        users.findUserByEmail(request.body.email, cb_sendEmail);    // buscamos el usuario en la BBDD

        function cb_sendEmail(errors, user){
            if (errors){
                response.render("forgot-password", {}); // falta por hacer
            }
            else{
                if(user){
                    console.log("Enviando correo a: " + request.body.email);
                    const secret = JWT_SECRET + user.password;
                    const payload = {
                        email: request.body.email,
                        id: user.id
                    };
            
                    const token = jwt.sign(payload, secret, {expiresIn: '15m'});
                    const link = `http://localhost:3300/reset-password/${user.id}/${token}`; // localhost:3300 hay que cambiarlo por back2study.herokuapp.com cuando este todo listo
                    console.log("Link creado: " + link);
            
                    // send mail with defined transport object
                    let info = transporter.sendMail({
                        from: '"Recuperar contraseña 👻" <back2study.gps@gmail.com>', // sender address
                        to: request.body.email, // list of receivers
                        subject: "Recuperar contraseña ✔", // Subject line
                        html: "<b>Correo enviado desde back2study. Link: " + link + "</b>", // html body
                    });
                }   
            }
        }
    }
    
}

module.exports = controllerU;