import { NotificacionNoEncontrada } from "../errors/notificacionesErrors/NotificacionNoEncontrada.js"
import { NotificacionBadRequestError } from "../errors/notificacionesErrors/NotificacionBadRequest.js"

export function notificacionErrorHandler(err, req, res, next) {
    console.log(err)
    if (err.constructor.name === NotificacionNoEncontrada.name) {
        return res.status(404).json({ message: err.message })
    }

    if (err.constructor.name === NotificacionBadRequestError.name) {
        return res.status(400).json({ message: err.message, errors: err.errors })
    }

    return res.status(500).json({ message: "Error del servidor" })
}