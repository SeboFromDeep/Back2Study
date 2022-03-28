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
                if(tipoTarea=='m'){
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
                else if(tipoTarea=='p'){
                    const sql="SELECT tareas_programadas.horas ,tareas_programadas.tipo " +
                    "FROM back2study.tareas JOIN tareas_programadas "+
                    "on tareas.id= tareas_programadas.id "+
                    " where tareas.usuario= ? and tareas.tipo='p'";
                    
                        connection.query(sql, [idUsuario],function(err,result){
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
            }
        })
    }
    


}


module.exports =DaoTask;