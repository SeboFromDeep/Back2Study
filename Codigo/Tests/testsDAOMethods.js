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
    get_id_user(email){
        this.pool.getConnection(function (err, connection) {
            if (err)
                console.log("Error de conexión a la base de datos");
            else {
                connection.query('USE back2study;');
                connection.query("SELECT id FROM users WHERE email = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err)
                            console.log("Error de acceso a la base de datos");
                        else
                            return rows;
                    });
            }
        });
    }

    // PONER BIEN LOS ATRIBUTOS DE LAS TAREAS, CAMBIOS EN LA BD
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

    // Elimina una tarea de la BD
    delete_task(id_tarea) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                console.log("Error de conexión a la base de datos");
            else {
                connection.query('USE back2study;');
                connection.query('SET SQL_SAFE_UPDATES = 0;');
                connection.query("DELETE FROM tareas WHERE id_tarea = ?",
                    [id_tarea],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err)
                            console.log("Error de acceso a la base de datos");
                        else
                            console.log("TAREA ELIMINADA");
                    });
            }
        });
    }

    // PONER BIEN LOS ATRIBUTOS DE LAS TAREAS, CAMBIOS EN LA BD
    // Devuelve el id de la tarea indicada
    get_id_task(tarea) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                console.log("Error de conexión a la base de datos");
            else {
                connection.query('USE back2study;');
                connection.query("SELECT id_tarea FROM tareas WHERE nombre = ? AND prioridad = ? AND categoria = ? AND id_usuario = ? AND fechafin = ? AND fechaini = ? AND tipo = ?",
                    [tarea.nombre, tarea.prioridad, tarea.categoria, tarea.id_usuario, tarea.fechafin, tarea.fechaini, tarea.tipo],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err)
                            console.log("Error de acceso a la base de datos");
                        else
                            return rows;
                    });
            }
        });
    }

    // PONER BIEN LOS ATRIBUTOS DE LAS TAREAS, CAMBIOS EN LA BD
    // Inserta una tarea manual en la BD
    insert_task_m(tarea_m) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                console.log("Error de conexión a la base de datos");
            else {
                connection.query('USE back2study;');
                const valor = "INSERT INTO tareas_manuales (...) VALUES (?)";
                connection.query(valor,
                    [],
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

    // PONER BIEN LOS ATRIBUTOS DE LAS TAREAS, CAMBIOS EN LA BD
    // Inserta una tarea programada en la BD
    insert_task_p(tarea_p) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                console.log("Error de conexión a la base de datos");
            else {
                connection.query('USE back2study;');
                const valor = "INSERT INTO tareas_programadas (...) VALUES (?)";
                connection.query(valor,
                    [],
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

}