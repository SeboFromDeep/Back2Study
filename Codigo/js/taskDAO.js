"use strict"

class DaoTask{
    constructor(pool){
        this.pool = pool;
        
    }

    listaTareas(callback, id){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{
                console.log("ID DE USUARIO "+id)
                const valor ="SELECT id, nombre, prioridad, categoria, fechafin ,fechaini, tipo FROM back2study.tareas where usuario= ?";
                connection.query(valor, [id],function(err,result){
                  
                    connection.release();
                    if(err){
                        console.log("ERROR:"+err.message);
                        callback(new ErrorEvent("Error de acceso a la base de datos"));
                    }
                    else{
                        
                        // console.log("RESULTADOS:"+ result);
                        callback(null, result);
                    }
                });
            }

        });
    }
    getDetailsTaskManual(idUsuario, idTarea, tipoTarea, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{
                // tareas.id, tareas.nombre, tareas.prioridad, tareas.categoria, tareas.fechafin, tareas.fechaini, tareas.tipo, "
                
                    const sql="SELECT tareas_manuales.hora_ini, tareas_manuales.hora_fin, tareas_manuales.dias_recurrentes, tareas_manuales.recurrente "+
                            "FROM back2study.tareas JOIN tareas_manuales on tareas.id= tareas_manuales.id_tarea where tareas.usuario= ? and tareas_manuales.id_tarea= ?";
                        connection.query(sql, [idUsuario, idTarea],function(err,result){
                            connection.release();
                            if(err){
                                console.log("ERROR:"+err.message);
                                callback(new ErrorEvent("Error de acceso a la base de datos"));
                            }
                            else{
                                
                                console.log("RESULTADOS:"+ result);
                                callback(null, result);
                            }
                        });
                
                
                    
                
            }
        })
    }

    getDetailsTaskProgram(idUsuario, idTarea, tipoTarea, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{

                const sql="SELECT tareas_programadas.horas ,tareas_programadas.tipo " +
                    "FROM back2study.tareas JOIN tareas_programadas "+
                    "on tareas.id= tareas_programadas.id "+
                    " where tareas.usuario= ? and tareas_programadas.id=?";
                    
                    connection.query(sql, [idUsuario, idTarea],function(err,result){
                        connection.release();
                        if(err){
                            console.log("ERROR:"+err.message);
                            callback(new ErrorEvent("Error de acceso a la base de datos"));
                        }
                        else{
                            
                            console.log("RESULTADOS:"+ result);
                            callback(null, result);
                        }
                    });
            }
        });
    }

    consultarTarea(callback, tarea){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{
                console.log("Consultar tarea con nombre:"+id)

                //Insertamos en la tabla padre
                const valor ="Select count(*) From tareas where fechaini BETWEEN ? AND ? AND (fechafin BETWEEN ? AND ?) AND(usuario=?)";
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

  

    añadirTareaManual(callback, tarea){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{
                console.log("ID DE USUARIO "+id)
                const valor ="Insert into tareas (nombre,prioridad,categoria,usuario,fechafin,fechaIni,tipo) values(?, ?, ?, ?, ?, ?, ?)";
                connection.query(valor,[tarea.nombre, tarea.prioridad, tarea.categoria, tarea.usuario, tarea.fechaFin, tarea.fechaIni, 'm'],
                function(err, idtarea){
                    if(err){
                        console.log("ERROR:"+err.message);
                        callback(new ErrorEvent
                            ("Error de acceso a la base de datos"));
                    }
                    else
                    {
                        const valor ="Insert into tareas_manuales (id,hora_ini,hora_fin,recurrente,dias_recurrentes) values(?, ?, ?, ?, ?)";
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


    añadirTareaProgramada(tarea, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{
                console.log("Insertando tarea de usuario " + tarea.usuario);
                const valor ="Insert into tareas (nombre,prioridad,categoria,usuario,fechafin,fechaIni, tipo) values(?, ?, ?, ?, ?, ?, ?)";
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
                                callback(null, result);
                            }

                        });
                    }
                });
            }

        });
    }
    
}


module.exports =DaoTask;