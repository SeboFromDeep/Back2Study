"use strict"

class DaoUsers{
    constructor(pool){
        this.pool =pool;
    }

    registro(usuario, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{
                console.log("Datos registro usuario: "+usuario.nombre+" "+usuario.correo+" "+usuario.pass); 
                connection.query('USE back2study;');
                //Buscamos en la BBDD si existe algún usuario con el nombre o el correo proporcionado
                const existeName = "SELECT * FROM back2study.users where username = ?  or email= ?";
                connection.query(existeName,[usuario.nombre, usuario.correo],
                    function(err, result){
                    
                    if(err){
                        console.log("ERROR: "+err.message);
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if (result.length==1){
                            //El usuario ya existe
                            callback(null, false);
                        }
                        else{
                            //Si no existe podemos registrar al usuario
                            const valor="INSERT INTO users (username, email, password) VALUES (?,?,?);";
                            connection.query(valor,[usuario.nombre, usuario.correo, usuario.pass],
                            function(err2, result2){
                                connection.release(); //devolver el pool de conexiones.
                                if(err2){
                                    console.log("ERROR: "+err.message);
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else{
                                    
                                    callback(null, true);
                                }
                            });
                        }
                       
                    }
                });



                
            }
        });
    }

    login(email, contrasena, callback) {
        console.log("DAO "+email+" "+contrasena);
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                console.log("Datos log usuario: "+ email +" "+ contrasena);
                connection.query('USE back2study;');
                connection.query("SELECT * FROM users WHERE email = ? AND password= ?" ,
                    [email,contrasena],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                                }
                            else {
                                console.log("DATOS DAO: "+rows[0].id+"/"+rows[0].username+"/"+rows[0].email+"/"+rows[0].password);
                                callback(null, rows[0]);
                            }
                        }
                    });
            }
        });
    }
    
    findUserByEmail(email, callback){
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
    
 
}

module.exports =DaoUsers;