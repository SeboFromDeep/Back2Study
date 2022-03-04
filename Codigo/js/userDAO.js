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
            // else{
            //     console.log("Datos insert usuario: "+usuario.correo+" "+usuario.nombre+" "+usuario.pass+" "+usuario.pass2+" "); 
            //     const valor="INSERT INTO usuarios (correo, contra, nombre, img) VALUES (?,?,?,?)";
            //     connection.query(valor,[usuario.correo, usuario.pass, usuario.nombre, usuario.imagen],
            //     //SIN IMAGEN
            //     // const valor="INSERT INTO usuarios (correo, contra, nombre) VALUES (?,?,?)";
            //     // connection.query(valor,[usuario.correo, usuario.pass, usuario.nombre],
            //         function(err, result){
            //             connection.release(); //devolver el pool de conexiones.
            //             if(err){
            //                 //console.log("ERROR: "+err.message);
            //                 callback(new Error("Error de acceso a la base de datos"));
            //             }
            //             else{
                            
            //                 callback(null, usuario.nombre);
            //             }
            //         });
            // }
        });
    }

    login(email, contrasena, callback) {
        console.log("DAO "+email+" "+contrasena)
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM usuarios WHERE correo = ? AND contra= ?" ,
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
                                        callback(null, rows[0]);
                                    }
                                }
                            });
            }
        });
    }
    
    
 
}

module.exports =DaoUsers;