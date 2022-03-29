// @GabrielGzS

"use strict"

class controllerUtils {
    static createResponseLocals(success, outputMessage, customLocals) {
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

    static createObjectFromRequest(request) {
        let object = { usuario: request.session.currentId }

        for (const [key, value] of Object.entries(request.body))
            object[key] = value

        return object
    }
}