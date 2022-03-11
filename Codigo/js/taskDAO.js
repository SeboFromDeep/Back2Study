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
                connection.query(valor, [id],function(err,result){
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
    


}


module.exports =DaoTask;