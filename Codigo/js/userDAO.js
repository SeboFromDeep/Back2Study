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
                            if(result2.affectedRows) resolve(true);
                            else callback(false);
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

    delete_user(email, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query('USE back2study;');
                connection.query('SET SQL_SAFE_UPDATES = 0;');
                connection.query("DELETE FROM users WHERE email = ?" ,
                    [email],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                                console.log("USUARIO ELIMINADO");
                                console.log(email);
                                callback(null, true);
                        }
                    });
            }
        });
    }
    
}

module.exports =DaoUsers;