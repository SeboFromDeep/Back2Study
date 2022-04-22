class DaoTests {

    constructor(pool) {
        this.pool = pool;
    }

    // Inserta un usuario en la BD
    insert_user(usuario) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                console.log("Error de conexión a la base de datos");
            else {
                connection.query('USE back2study;');
                connection.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                    [usuario.username, usuario.email, usuario.password],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err)
                            console.log("Error de acceso a la base de datos");
                        else
                            console.log("USUARIO INSERTADO");
                    });
            }
        });
    }

    // Elimina un usuario de la BD
    delete_user(id_usuario) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                console.log("Error de conexión a la base de datos");
            else {
                connection.query('USE back2study;');
                connection.query('SET SQL_SAFE_UPDATES = 0;');
                connection.query("DELETE FROM users WHERE id = ?",
                    [id_usuario],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err)
                            console.log("Error de acceso a la base de datos");
                        else
                            console.log("USUARIO ELIMINADO");
                    });
            }
        });
    }

    // Devuelve el id del usuario indicado
    get_id_user(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"));
            else {
                connection.query('USE back2study;');
                connection.query("SELECT id FROM users WHERE email = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err)
                            callback(new Error("Error de acceso a la base de datos"));
                        else if (rows.length != 1)
                            callback(null, false);
                        else
                            callback(null, rows[0].id);
                    });
            }
        });
    }

    // Inserta una tarea en la BD
    insert_task(tarea) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                console.log("Error de conexión a la base de datos");
            else {
                connection.query('USE back2study;');
                const valor = "INSERT INTO tareas (nombre, prioridad, categoria, id_usuario, fechafin, fechaini, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)";
                connection.query(valor,
                    [tarea.nombre, tarea.prioridad, tarea.categoria, tarea.id_usuario, tarea.fechafin, tarea.fechaini, tarea.tipo],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err)
                            console.log("Error de acceso a la base de datos");
                        else
                            console.log("TAREA INSERTADA");
                    });
            }
        });
    }

    // Devuelve el id de la tarea indicada
    get_id_task(tarea, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"));
            else {
                connection.query('USE back2study;');
                connection.query("SELECT id_tarea FROM tareas WHERE nombre = ? AND prioridad = ? AND categoria = ? AND id_usuario = ? AND fechafin = ? AND fechaini = ? AND tipo = ?",
                    [tarea.nombre, tarea.prioridad, tarea.categoria, tarea.id_usuario, tarea.fechafin, tarea.fechaini, tarea.tipo],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err)
                            callback(new Error("Error de acceso a la base de datos"));
                        else if (rows.length != 1)
                            callback(null, false);
                        else
                            callback(null, rows[0].id_tarea);
                    });
            }
        });
    }

    // Inserta una tarea manual en la BD
    insert_task_m(tarea_m) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                console.log("Error de conexión a la base de datos");
            else {
                connection.query('USE back2study;');
                const valor = "INSERT INTO tareas_manuales (id_tarea, hora_ini, hora_fin, recurrente, dias_recurrentes) VALUES (?, ?, ?, ?, ?)";
                connection.query(valor,
                    [tarea_m.id_tarea, tarea_m.hora_ini, tarea_m.hora_fin, tarea_m.recurrente, tarea_m.dias_recurrentes],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err)
                            console.log("Error de acceso a la base de datos");
                        else
                            console.log("TAREA MANUAL INSERTADA");
                    });
            }
        });
    }

    // Inserta una tarea programada en la BD
    insert_task_p(tarea_p) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                console.log("Error de conexión a la base de datos");
            else {
                connection.query('USE back2study;');
                const valor = "INSERT INTO tareas_programadas (horas, id_programada, tipo) VALUES (?, ?, ?)";
                connection.query(valor,
                    [tarea_p.horas, tarea_p.id_programada, tarea_p.tipo_ds],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err)
                            console.log("Error de acceso a la base de datos");
                        else
                            console.log("TAREA PROGRAMADA INSERTADA");
                    });
            }
        });
    }

}

module.exports = DaoTests;