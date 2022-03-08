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
                console.log("Datos insert usuario: "+usuario.nombre+" "+usuario.correo+" "+usuario.pass); 
                connection.query('USE back2study;');
                const valor="INSERT INTO users (username, email, password) VALUES (?,?,?)";
                connection.query(valor,[usuario.nombre, usuario.correo, usuario.pass],
                    function(err, result){
                    connection.release(); //devolver el pool de conexiones.
                    if(err){
                        console.log("ERROR: "+err.message);
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        
                        callback(null, usuario.nombre);
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
                                //console.log("DAOOOO "+rows.);
                                callback(null, rows[0]);
                            }
                        }
                    });
            }
        });
    }
    
    
 
}

module.exports =DaoUsers;