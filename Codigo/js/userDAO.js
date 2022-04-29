"use strict"

const { resolve } = require("path");

class DaoUsers{
    constructor(pool){
        this.pool =pool;
    }

    /*
    Comprueba que no E un usuario en la base de datos
    True --> El usuario/correo existe
    False --> No Existe
    */
    existeUsuario(usuario){
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function(err,connection){
                if(err){
                    reject(new Error("Error de conexión a la base de datos"));
                }
                else{
                    console.log("Comprobacion si existe usuario: "+usuario.nombre+" "+usuario.correo+" "+usuario.pass); 
                    const existeName = "SELECT * FROM back2study.users where username = ?";
                    connection.query(existeName,[usuario.nombre],
                    function(err, result){
                        connection.release();
                        if(err){
                            
                            console.log("ERROR: "+err.message);
                            reject(new Error("Error de acceso a la base de datos"));
                        }
                        else{
                            
                            if (result.length==1) resolve(true);
                            else resolve(false);
                        }
                    });
                }
            });
        });
    }
    
    /*
    Comprueba que no E un correo en la base de datos
    True --> El usuario/correo existe
    False --> No Existe
    */
    existeCorreo(usuario){
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function(err,connection){
                if(err){
                    reject(new Error("Error de conexión a la base de datos"));
                }
                else{
                    
                    //El usuario no existe
                    const existeName = "SELECT * FROM back2study.users where email= ?";
                    connection.query(existeName,[usuario.correo],
                        function(err, result2){
                        connection.release();
                        if(err){
                            console.log("ERROR: "+err.message);
                            reject(new Error("Error de acceso a la base de datos"));
                        }
                        else{
                            if (result2.length==1) resolve(true);
                            else resolve(false);
                        }
                    });
                }
            });
        });
    }

    registro(usuario){
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function(err,connection){
                if(err){
                    reject(new Error("Error de conexión a la base de datos"));
                }
                else{
                    console.log("Datos registro usuario: "+usuario.nombre+" "+usuario.correo+" "+usuario.pass); 
                    
                    const valor="INSERT INTO users (username, email, password) VALUES (?,?,?);";
                    connection.query(valor,[usuario.nombre, usuario.correo, usuario.pass],
                    function(err2, result2){
                        connection.release(); //devolver el pool de conexiones.
                        if(err2){
                            console.log("ERROR: "+err.message);
                            reject(new Error("Error de acceso a la base de datos"));
                        }
                        else{     
                            if(result2.affectedRows) resolve(result2.insertId);
                            else resolve(false);
                        }
                    });
                    
                }
            });
        });
    }

    

    login(email, password) {
        return new Promise((resolve, reject) => {
            //console.log("DAO "+email+" "+password);
            this.pool.getConnection(function(err, connection) {
                if (err) {
                    reject(new Error("Error de conexión a la base de datos"));
                }
                else {
                    //console.log("Datos log usuario: "+ email +" "+ password);
                    // connection.query('USE back2study;');
                    connection.query("SELECT * FROM users WHERE email = ? AND password= ?" ,
                        [email,password],
                        function(err, rows) {
                            connection.release(); // devolver al pool la conexión
                            if (err) {
                                reject(new Error("Error de acceso a la base de datos"));
                            }
                            else {
                                console.log(rows);
                                if (rows.length === 0) {
                                    resolve(false); //no está el usuario con el password proporcionado
                                }
                                else {
                                    // console.log("DATOS DAO: "+rows[0].id+"/"+rows[0].username+"/"+rows[0].email+"/"+rows[0].password);
                                    resolve(rows[0]);
                                }
                            }
                        });
                }
            });
        });
    }
    

    findUserByEmail(email){
        return new Promise((resolve, reject) => {
            console.log("Buscando usuario con correo " + email + " en la BBDD");
            this.pool.getConnection(function(error, connection){
                if(error){
                    reject(new Error("Error de acceso a la base de datos"));
                }
                else{
                    connection.query("USE back2study;");
                    connection.query("SELECT * FROM users WHERE email = ?;", [email],
                    function(errors, user){
                        connection.release();
                        if(errors){
                            reject(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if(user.length === 0){
                                console.log("Usuario no encontrado");
                                reject(null);
                            }
                            else{
                                console.log("Usuario encontrado");
                                resolve(user[0]);
                            }
                        }
                    });
                }
            });
        });
    }

    existePass(pass, callback){
        console.log("Buscando usuario con correo " + email + " en la BBDD");
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de acceso a la base de datos"));
            }
            else{
                connection.query("USE back2study;");
                connection.query("SELECT * FROM users WHERE email = ?;", [email],
                function(errors, user){
                    connection.release();
                    if(errors){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(user.length === 0){
                            console.log("Usuario no encontrado");
                            callback(null, false);
                        }
                        else{
                            console.log("Usuario encontrado");
                            callback(null, user[0]);
                        }
                    }
                });
            }
        });
    }

    modPass(pass, callback){

    }

    changePassword(email, newPassword){
        return new Promise ((resolve, reject) =>{
            this.pool.getConnection(function(err, connection) {
                if (err) {
                    reject(new Error("Error de conexión a la base de datos"));
                }
                else {
                    //console.log("Cambiando contraseña de usuario " +  email);
                    connection.query("UPDATE users SET password = ? WHERE email = ?" ,
                        [newPassword, email],
                        function(err, rows) {
                            connection.release(); // devolver al pool la conexión
                            if (err) {
                                reject(new Error("Error de acceso a la base de datos"));
                            }
                            else {
                                if (rows.affectedRows === 0) {
                                    resolve(false); //no está el usuario con el email proporcionado
                                }
                                else {
                                    resolve(true);
                                }
                            }
                        });
                }
            });
        });
    }
}

module.exports =DaoUsers;