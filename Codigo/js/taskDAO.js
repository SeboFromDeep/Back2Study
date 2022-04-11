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
                    reject(new Error("Error de conexión a la base de datos"));
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

  

    addTaskManual(callback, tarea){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{
                console.log("ID DE USUARIO "+id)
                const valor ="Insert into tareas (nombre,prioridad,categoria,id_usuario,fechafin,fechaIni,tipo) values(?, ?, ?, ?, ?, ?, ?)";
                connection.query(valor,[tarea.nombre, tarea.prioridad, tarea.categoria, tarea.usuario, tarea.fechaFin, tarea.fechaIni, 'm'],
                function(err, idtarea){
                    if(err){
                        console.log("ERROR:"+err.message);
                        callback(new ErrorEvent
                            ("Error de acceso a la base de datos"));
                    }
                    else
                    {
                        const valor ="Insert into tareas_manuales (id_tarea,hora_ini,hora_fin,recurrente,dias_recurrentes) values(?, ?, ?, ?, ?)";
                        connection.query(valor,[idtarea, tarea.horaIni, tarea.horaFin, tarea.recurrente, tarea.diasRecurrentes],
                        function(err, result){

                            if(err){
                                console.log("ERROR:"+err.message);
                                callback(new ErrorEvent
                                    ("Error al insertar tarea"));
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

        });
    }


    addTaskProgram(tarea, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{
                console.log("Insertando tarea de usuario " + tarea.usuario);
                const valor ="Insert into tareas (nombre,prioridad,categoria,id_usuario,fechafin,fechaIni, tipo) values(?, ?, ?, ?, ?, ?, ?)";
                connection.query(valor,[tarea.nombre, tarea.prioridad, tarea.categoria, tarea.usuario, tarea.fechaFin, tarea.fechaIni, 'p'],
                function(err, tareacreada){
                    if(err){
                        console.log("ERROR:"+err.message);
                        callback(new Error
                            ("Error de acceso a la base de datos"));
                    }
                    else
                    {
                        console.log("Tarea creada con id " + tareacreada.insertId);
                        const valor ="Insert into tareas_programadas (id, horas, tipo) values(?, ?, ?)";
                        connection.query(valor,[tareacreada.insertId, tarea.horas, tarea.tipo],
                        function(err, result){
                            connection.release();
                            if(err){
                                console.log("ERROR:"+err.message);
                                callback(new Error
                                    ("Error al insertar tarea"));
                            }
                            else
                            {
                                console.log("Tarea programada añadida");
                                callback(null, tareacreada.insertId);
                            }

                        });
                    }
                });
            }

        });
    }
    
}


module.exports =DaoTask;