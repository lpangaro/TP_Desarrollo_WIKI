import { ProductoBadRequestError } from "../errors/productosErrors/ProductoBadRequestError.js"
import { UsuarioNoEncontradoError } from "../errors/usuariosErrors/UsuarioNoEncontradoError.js"
import { ProductosNoExistenError } from "../errors/productosErrors/ProductosNoExistenError.js";
import { ProductoNoEncontradoError } from "../errors/productosErrors/ProductoNoEncontradoError.js";

function productErrorHandler(err, req, res, next) {
 
    console.log(err)
    if (err.constructor.name === ProductoBadRequestError.name) {
        return res.status(400).json({ message: err.message, errors: err.errors });
    }

    if (err.constructor.name === UsuarioNoEncontradoError.name) {
        return res.status(404).json({ message: err.message })
    }

    if (err.constructor.name === ProductosNoExistenError.name) {
        return res.status(404).json({ message: err.message })
    }

    if (err.constructor.name === ProductoNoEncontradoError.name) {
        return res.status(404).json({ message: err.message })
    }
    return res.status(500).json({ message: "Error interno del servidor" });
}

export { productErrorHandler }