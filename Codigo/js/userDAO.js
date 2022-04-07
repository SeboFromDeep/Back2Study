"use strict"

class DaoUsers{
    constructor(pool){
        this.pool =pool;
    }

    /*
    True --> El usuario/correo existe
    False --> No Existe
    */
    existeUsuario(usuario, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{//HOOOOOLA
                console.log("Comprobacion si existe usuario: "+usuario.nombre+" "+usuario.correo+" "+usuario.pass); 
                const existeName = "SELECT * FROM back2study.users where username = ?";
                connection.query(existeName,[usuario.nombre],
                function(err, result){
                
                    if(err){
                        console.log("ERROR: "+err.message);
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        
                        if (result.length==1){
                            //El usuario ya existe
                            callback(null, true, "El Usuario con nombre '"+result[0].username+ "' ya existe");
                        }
                        else{
                            //El usuario no existe
                            const existeName = "SELECT * FROM back2study.users where email= ?";
                            connection.query(existeName,[usuario.correo],
                                function(err, result2){
                                
                                if(err){
                                    console.log("ERROR: "+err.message);
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else{
                                    
                                    if (result2.length==1){
                                        callback(null, true, "El Correo electronico '"+result2[0].email+ "' ya existe");
                                    }
                                    else    callback(null, false);
                                }
                            });
                        }
                    }
                });
            }
        });
    }
    

    registro(usuario, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{//HOOOOOLA
                console.log("Datos registro usuario: "+usuario.nombre+" "+usuario.correo+" "+usuario.pass); 
                connection.query('USE back2study;');
                const valor="INSERT INTO users (username, email, password) VALUES (?,?,?);";
                connection.query(valor,[usuario.nombre, usuario.correo, usuario.pass],
                function(err2, result2){
                    connection.release(); //devolver el pool de conexiones.
                    if(err2){
                        console.log("ERROR: "+err.message);
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        console.log(result2);
                        if(result2.affectedRows)    callback(null, true);
                        else callback(null, false);
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
                // connection.query('USE back2study;');
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
                                // console.log("DATOS DAO: "+rows[0].id+"/"+rows[0].username+"/"+rows[0].email+"/"+rows[0].password);
                                callback(null, rows[0]);
                            }
                        }
                });
            }
        });
    }
}

module.exports =DaoUsers;