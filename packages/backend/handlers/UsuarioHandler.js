import { UsuarioNoEncontradoError } from "../errors/usuariosErrors/UsuarioNoEncontradoError.js"
import { UsuarioDoesNotExist } from "../errors/usuariosErrors/UsuarioDoesNotExist.js"
import { UsuarioBadRequest } from "../errors/usuariosErrors/UsuarioBadRequest.js"
import { UsuariosNoExistenError } from "../errors/usuariosErrors/UsuariosNoExistenError.js"
import { CredencialesInvalidasError } from "../errors/usuariosErrors/CredencialesInvalidasError.js"

function usuarioErrorHandler(err, req, res, next) {

    console.log(err)
    if (err.constructor.name === UsuarioDoesNotExist.name) {
        return res.status(400).json({ message: err.message })
    }

    if (err.constructor.name === UsuarioNoEncontradoError.name) {
        return res.status(404).json({ message: err.message })
    }

    if (err.constructor.name === UsuarioBadRequest.name) {
        return res.status(400).json({ message: err.message, errors: err.errors });
    }

    if (err.constructor.name === UsuariosNoExistenError.name) {
        return res.status(404).json({ message: err.message });
    }

    if (err.constructor.name === CredencialesInvalidasError.name) {
        return res.status(401).json({ message: err.message })
    }
    return res.status(500).json({ message: "Error interno del servidor" });
}

export { usuarioErrorHandler }