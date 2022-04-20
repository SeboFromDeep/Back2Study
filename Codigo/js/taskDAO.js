"use strict"
const { resolve } = require("path");

class DaoTask{
    constructor(pool){
        this.pool = pool;
        
    }

    listaTareas(id){
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function(err,connection){
                if(err){
                    reject(new Error("Error de conexión a la base de datos",));
                }
                else{
                    const valor ="SELECT id_tarea, nombre, prioridad, categoria, fechafin ,fechaini, tipo FROM back2study.tareas where id_usuario= ?";
                    connection.query(valor, [id],
                        function(err, taskList){
                            connection.release();
                            if(err){
                                console.log("ERROR:"+err.message);
                                reject(new Error("Error de acceso a la base de datos"));
                            }
                            else{
                                
                                if(taskList.length>0) resolve(taskList);
                                else resolve(false);
                                
                            }
                    });
                }
    
            });

        });
        
    }

    

    getDetailsTaskManual(idUsuario, idTarea){
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function(err,connection){
                if(err){
                    reject(new Error("Error de conexión a la base de datos"));
                }
                else{
                    // tareas.id, tareas.nombre, tareas.prioridad, tareas.categoria, tareas.fechafin, tareas.fechaini, tareas.tipo, "
                    const sql="SELECT tareas.nombre, tareas.prioridad, tareas.categoria, tareas.fechafin, tareas.fechaini, tareas.tipo, tareas_manuales.hora_ini, tareas_manuales.hora_fin, tareas_manuales.dias_recurrentes, tareas_manuales.recurrente "+
                            "FROM back2study.tareas JOIN tareas_manuales on tareas.id_tarea= tareas_manuales.id_tarea where tareas.id_usuario= ? and tareas_manuales.id_tarea= ?";
                        connection.query(sql, [idUsuario, idTarea],
                            function(err,result){
                            connection.release();
                            if(err){
                                console.log("ERROR:"+err.message);
                                reject(new Error("Error de acceso a la base de datos"));
                            }
                            else{
                                console.log("RESULTADOS Manual:"); 
                                console.log(result.length);
                                if(result.length>=1)    resolve(result);
                                else resolve(false);
                                
                            }
                        });
                }
            })
        });
        
    }

    getDetailsTaskProgram(idUsuario, idTarea){
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function(err,connection){
                if(err){
                    reject(new Error("Error de conexión a la base de datos"));
                }
                else{
                    // tareas.id, tareas.nombre, tareas.prioridad, tareas.categoria, tareas.fechafin, tareas.fechaini, tareas.tipo, "
                    const sql="SELECT tareas.nombre, tareas.prioridad, tareas.categoria, tareas.fechafin, tareas.fechaini, tareas.tipo ,tareas_programadas.horas ,tareas_programadas.tipo " +
                    "FROM back2study.tareas JOIN tareas_programadas "+
                    "on tareas.id_tarea= tareas_programadas.id_programada "+
                    " where tareas.id_usuario= ? and tareas_programadas.id_programada=?";
                    connection.query(sql, [idUsuario, idTarea],
                            function(err,result){
                            connection.release();
                            if(err){
                                console.log("ERROR:"+err.message);
                                reject(new Error("Error de acceso a la base de datos"));
                            }
                            else{
                                console.log("RESULTADOS Programada:"); 
                                console.log(result.length);
                                if(result.length==1)    resolve(result);
                                else resolve(false);
                                
                            }
                        });
                }
            })
        })
        
    }

    consultarTarea(callback, tarea){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{
                console.log("Consultar tarea con nombre:"+id)

                //Insertamos en la tabla padre
                const valor ="Select count(*) From tareas where fechaini BETWEEN ? AND ? AND (fechafin BETWEEN ? AND ?) AND(id_usuario=?)";
                connection.query(valor,[tarea.fechaIni, tarea.fechaFin, tarea.user],
                function(err, result){
                    connection.release();
                    if(err){
                        console.log("ERROR:"+err.message);
                        callback(new ErrorEvent
                            ("Error de acceso a la base de datos"));
                    }
                    else
                    {
                        console.log("RESULTADOS:"+ result);
                        callback(null, result);
                    }
                });
            }

        });
    }

  

    addTaskManual(tarea, tareasM, usuario){
        return new Promise((resolve, reject) =>{
            this.pool.getConnection(function(err,connection){
                if(err){
                    reject(new Error("Error de conexión a la base de datos"));
                }
                else{
                    console.log("Insertando tarea de usuario " + tarea.usuario);
                    const valor ="Insert into tareas (nombre,prioridad,categoria,id_usuario,fechafin,fechaIni, tipo) values(?, ?, ?, ?, ?, ?, ?)";
                    connection.query(valor,
                    [tarea.nombre, tarea.prioridad, tarea.categoria, usuario, tarea.fechaFin, tarea.fechaIni, 'm'],
                    function(err, tareacreada){
                        if(err){
                            
                            reject(new Error("Error de conexión a la base de datos"));
                            
                        }
                        else if(tareacreada.affectedRows===1){

                            for (let i = 0; i < tareasM.length; i++) {
                                // console.log(tareas[i].dia.replace(/(,)/gm,"")+" "+tareas[i].horaIni+" "+tareas[i].horaFin+" "+tareas[i].recursivo);
                                const valor ="Insert into tareas_manuales (id_tarea, hora_ini, hora_fin, recurrente, dias_recurrentes) values(?, ?, ?, ?, ?)";
                                connection.query(valor,[tareacreada.insertId, tareasM[i].horaIni, tareasM[i].horaFin, tareasM[i].recursivo, tareasM[i].dia.replace(/(,)/gm,"")],
                                function(err, tareaHijaP){
                                    
                                    if(err){
                                        console.log("ERROR:"+err.message);
                                        reject(new Error("Error al insertar tarea"));
                                    }
                                    else{
                                        console.log(tareaHijaP);
                                        resolve(tareacreada.insertId);
                                        // if(tareaHijaP.affectedRows===1)    
                                        // else resolve(false);
                                    } 
                                });
                            }
                            connection.release();
                            
                            
                        }
                        else resolve(false);
                    });
                }
    
            });
        });
    }


    addTaskProgram(tarea){
        return new Promise((resolve, reject) =>{
            this.pool.getConnection(function(err,connection){
                if(err){
                    reject(new Error("Error de conexión a la base de datos"));
                }
                else{
                    console.log("Insertando tarea de usuario " + tarea.usuario);
                    const valor ="Insert into tareas (nombre,prioridad,categoria,id_usuario,fechafin,fechaIni, tipo) values(?, ?, ?, ?, ?, ?, ?)";
                    connection.query(valor,
                    [tarea.nombre, tarea.prioridad, tarea.categoria, tarea.usuario, tarea.fechaFin, tarea.fechaIni, 'p'],
                    function(err, tareacreada){
                        if(err){
                            
                            reject(new Error("Error de conexión a la base de datos"));
                            
                        }
                        else if(tareacreada.affectedRows===1){
                            const valor ="Insert into tareas_programadas (id_programada, horas, tipo) values(?, ?, ?)";
                            connection.query(valor,[tareacreada.insertId, tarea.horas, tarea.tipo],
                            function(err, tareaHijaP){
                                connection.release();
                                if(err){
                                    console.log("ERROR:"+err.message);
                                    reject(new Error("Error al insertar tarea"));
                                }
                                else if(tareaHijaP.affectedRows===1)    resolve(tareacreada.insertId);
                                else resolve(false);
                            });
                        }
                        else resolve(false);
                    });
                }
    
            });
        });
  
    }

     /*
    Comprueba que existe una tarea en la base de datos
    True --> La tarea existe
    False --> No Existe
    */
    //Es posible que esta comprobacion sobre
    existeTarea(idUsuario, idTarea) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function(err,connection){
                if(err){
                    reject(new ErrorEvent("Error de conexión a la base de datos"));
                }
                else{
                    const existeTarea = "SELECT * FROM back2study.tareas WHERE id_tarea = ? && id_usuario = ?";
                    connection.query(existeTarea,[idTarea, idUsuario],
                    function(err, result){
                    
                        if(err){
                            console.log("ERROR: "+err.message);
                            reject(new Error("Error de acceso a la base de datos"));
                        }
                        else{
                            
                            if (result.length==1){
                                console.log("La tarea existe")
                                resolve(true);
                            }   
                            else resolve(false);
                        }
                    });
                }
            });
        });
    }
    
    deleteTask(idUsuario, idTarea){
        return new Promise((resolve, reject) =>{
            this.pool.getConnection(function(err, connection) {
                if (err) reject(new Error("Error de conexión a la base de datos"));
                else{
                    const valor ="DELETE FROM tareas WHERE tareas.id_usuario = ? and tareas.id_tarea = ?";
                    // const valor ="DELETE FROM tareas_manuales WHERE id_tarea = ?"; //borrado físico
                    connection.query(valor ,[idUsuario, idTarea],
                        function(err, rows) {
                            if(err){
                                console.log("ERROR:"+err.message);
                                reject(new Error("Error al borrar tarea"));
                            }
                            else{
                                
                                if(rows.affectedRows===1)    resolve(idTarea);
                                else resolve(false);
                            } 
                                

                        });

                }


            });
        });
    }
    
    //     deleteTaskManual(idUsuario, idTarea) {
    //         return new Promise((resolve, reject) => {
    //          this.pool.getConnection(function(err, connection) {
    //             if (err) {
    //                 reject(new Error("Error de conexión a la base de datos"));
    //             }
    //             else {
    //                 connection.query('USE back2study;');
    //                 connection.query('SET SQL_SAFE_UPDATES = 0;');
    //                 //Borramos en la tabla hija
    //                 const valor ="DELETE FROM tareas_manuales WHERE id_tarea = ?"; //borrado físico
    //                 connection.query(valor ,[idTarea],
    //                     function(err, rows) {
    //                         connection.release(); // devolver al pool la conexión
    //                         if (err) {
    //                             reject(new Error("Error de acceso a la base de datos"));
    //                         }
    //                         else {
    //                                 //Borramos en la tabla padre
    //                                 const valor ="DELETE FROM tareas WHERE usuario = ? && id = ?";
    //                                 connection.query(valor,[idUsuario, idTarea],
    //                                     function(err, rows){
    //                                         connection.release();
    //                                         if(err){
    //                                             reject(new Error
    //                                                 ("Error de acceso a la base de datos"));
    //                                         }
    //                                         else
    //                                         {
    //                                             console.log("Tarea eliminada con éxito");
    //                                             resolve(true);
    //                                         }
    //                                     });
    //                               }
    //                     });
                    
    //                 }
                
    //          });
    //         });
    //    }
       
    //     //    DELETE FROM tareas WHERE where tareas.id_usuario= ? and tareas.id_tarea=?
    //    deleteTaskProgram(idUsuario, idTarea) {
    //     return new Promise((resolve, reject) => {
    //     this.pool.getConnection(function(err, connection) {
    //         if (err) {
    //             reject(new Error("Error de conexión a la base de datos"));
    //         }
    //         else {
    //             // connection.query('USE back2study;');
    //             // connection.query('SET SQL_SAFE_UPDATES = 0;');
    //             //Borramos en la tabla hija
    //             const valor ="DELETE FROM tareas_programadas WHERE id = ?";
    //             connection.query(valor ,[idTarea],
    //                 function(err, rows) {
    //                     connection.release(); // devolver al pool la conexión
    //                     if (err) {
    //                         reject(new Error("Error de acceso a la base de datos"));
    //                     }
    //                     else {
    //                             //Borramos en la tabla padre
    //                             const valor ="DELETE FROM tareas WHERE usuario = ? && id = ?";
    //                             connection.query(valor,[idUsuario, idTarea],
    //                                 function(err, rows){
    //                                     connection.release();
    //                                     if(err){
    //                                         reject(new Error
    //                                             ("Error de acceso a la base de datos"));
    //                                     }
    //                                     else
    //                                     {
    //                                         console.log("Tarea eliminada con éxito");
    //                                         resolve(true);
    //                                     }
    //                                 });
    //                           }
    //                 });
                
    //             }
            
    //      });
    //     });
    // }
    
}


module.exports =DaoTask;