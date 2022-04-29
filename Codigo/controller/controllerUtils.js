// @GabrielGzS

module.exports.createResponseLocals = function(success, outputMessage, customLocals) {
    let locals = {
        title: success == true ? "Exito" : "Error",
        outputMessage: outputMessage,
        tipoAlert: success == true ? "alert-success" : "alert-danger" 
    }

    if (customLocals) {
        for (const [key, value] of Object.entries(customLocals))
            locals[key] = value
    }

    return locals
}

module.exports.createObjectFromRequest = function(request) {
    let object = { usuario: request.session.id_ }

    for (const [key, value] of Object.entries(request.body))
        object[key] = value

    return object
}

module.exports.fixObject = function (objectToFix, initialLines, linesPerTask) {
    var newObject = { tasks: [] }
    var initialCount = initialLines // inicializamos el initialCount a lineas iniciales para saber cuando pasar a la fase de tareas
    var currentlyAddedTasks = 0 // cuantas tareas tiene el newObject incluidas actualmente 
    var tasksToAdd = parseInt(objectToFix.oculto) // las tareas que tiene el objectToFix
    var currentTaskLine = 0 // linea actual a procesar
    var currentTask // el objeto de la tarea actual que se esta procesando
    for (const key in objectToFix) {
        if (initialCount > 0) { // fase de lineas iniciales (copiamos las lineas tal cual)
            newObject[key] = objectToFix[key]
            initialCount--;
        } else { // fase de tareas (aqui procesamos todo linea a linea)
            let newVar = objectToFix[key] // cogemos el valor de la nueva linea a procesar
            if (currentTaskLine == 0) { // si empezamos en una linea nueva, creamos el objeto de la tarea que vamos a guardar
                if (tasksToAdd == currentlyAddedTasks) return newObject;
                currentTask = {}
                newObject.tasks[currentlyAddedTasks] = currentTask // se incluye aqui, pero las tablas van por referencia, se pueden modificar mas adelante
                currentlyAddedTasks++;

                // si la currentTaskLine es 0, estamos procesando el dia
                // aprovechamos y ya metemos aqui
                let fixedVar = ""
                for (const newKey in newVar) // vamos string por string concatenando con separador
                    fixedVar = fixedVar + newVar[newKey] + ",";
                // actualizamos el valor de esa linea ya que lo hemos procesado
                newVar = fixedVar.slice(0, -1); // quita la ultima coma del string (esto si fuera necesario formatear con un separador)
            }
            currentTask[key.replace(/\d+/g, '')] = newVar // ese replace quita los numeros del string para dejar solo "dia", etc
            currentTaskLine = (currentTaskLine+1)%linesPerTask; // 4 son las lineas por cada tarea
        }
        //console.log(`${key}: ${objectToFix[key]}`);
    }
    return newObject;
}