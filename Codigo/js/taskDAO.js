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
                const valor ="SELECT id, nombre, fechaFin, prioridad FROM back2study.tareas where usuario= ?";
                connection.query(valor, [id] ,function(err,result){
                    connection.release();
                    if(err){
                        console.log("ERROR:"+err.message);
                        callback(new ErrorEvent("Error de acceso a la base de datos"));
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

  

    añadirTareaRapida(callback, tarea){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{
                console.log("ID DE USUARIO "+id)
                const valor ="Insert into tareas (nombre,prioridad,categoria,usuario,fechafin,fechaIni) values(?, ?, ?, ?, ?, ?)";
                connection.query(valor,[tarea.nombre, tarea.prioridad, tarea.categoria, tarea.usuario, tarea.fechaFin, tarea.fechaIni],
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


    añadirTareaProgramada(callback, tarea){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{
                console.log("ID DE USUARIO "+id)
                const valor ="Insert into tareas (nombre,prioridad,categoria,usuario,fechafin,fechaIni) values(?, ?, ?, ?, ?, ?)";
                connection.query(valor,[tarea.nombre, tarea.prioridad, tarea.categoria, tarea.usuario, tarea.fechaFin, tarea.fechaIni],
                function(err, idtarea){
                    if(err){
                        console.log("ERROR:"+err.message);
                        callback(new ErrorEvent
                            ("Error de acceso a la base de datos"));
                    }
                    else
                    {
                        const valor ="Insert into tareas_programadas (id,hora_ini,hora_fin,recurrente,dias_recurrentes) values(?, ?, ?, ?, ?)";
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
    
}


module.exports =DaoTask;