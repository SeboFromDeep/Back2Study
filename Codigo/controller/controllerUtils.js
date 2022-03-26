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