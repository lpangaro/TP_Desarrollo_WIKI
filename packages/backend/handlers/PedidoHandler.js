import { Pedido } from '../domain/pedidos/Pedido.js';
import { ItemPedido } from '../domain/pedidos/ItemPedido.js';
import { DireccionDeEntrega } from '../domain/pedidos/DireccionDeEntrega.js';
import { PedidoNoEncontradoError } from "../errors/pedidosErrors/PedidoNoEncontradoError.js"
import { CambioEstadoInvalidoError } from "../errors/pedidosErrors/CambioEstadoInvalidoError.js"
import { PermisoDenegadoError } from "../errors/pedidosErrors/PermisoDenegadoError.js"
import { UsuarioNoEncontradoError } from "../errors/usuariosErrors/UsuarioNoEncontradoError.js"
import { PedidoNoCreadoError } from "../errors/pedidosErrors/PedidoNoCreadoError.js"
import { PedidoBadRequestError } from "../errors/pedidosErrors/PedidoBadRequestError.js"
import { ProductoNoEncontradoError } from "../errors/productosErrors/ProductoNoEncontradoError.js"

class PedidoHandler {
    crearItemPedido(producto, cantidad, precio) {
        return new ItemPedido(producto, cantidad, precio);
    }

    crearDireccionEntrega(direccionInput) {
        return new DireccionDeEntrega(
            direccionInput.calle,
            direccionInput.altura,
            direccionInput.departamento,
            direccionInput.codigoPostal,
            direccionInput.ciudad,
            direccionInput.provincia,
            direccionInput.pais,
            direccionInput.lat,
            direccionInput.lon
        );
    }

    crearPedido(comprador, items, moneda, direccionEntrega) {
        return new Pedido(undefined, comprador, items, moneda, direccionEntrega);
    }

    validarCambioEstado(pedido, nuevoEstadoRaw) {
        const nuevoEstado = String(nuevoEstadoRaw).toUpperCase();  // Insensibilidad a mayúsculas

        const estadoActual = String(pedido.estado).toUpperCase();

        if (estadoActual === nuevoEstado) {
            throw new CambioEstadoInvalidoError('El pedido ya está en el estado solicitado');
        }

        if (nuevoEstado === 'CANCELADO' && (estadoActual === 'ENVIADO' || estadoActual === 'ENTREGADO')) {
            throw new CambioEstadoInvalidoError('No se puede cancelar un pedido ya enviado o entregado');
        }

        if ((nuevoEstado === 'ENVIADO' || nuevoEstado === 'PENDIENTE') && estadoActual === 'ENTREGADO') {
            throw new CambioEstadoInvalidoError('Este pedido ya fue entregado');
        }

        if (nuevoEstado === 'PENDIENTE' && (estadoActual === 'ENTREGADO' || estadoActual === 'CANCELADO')) {
            throw new CambioEstadoInvalidoError('Este pedido ya fue cancelado o entregado');
        }
        if (nuevoEstado === 'PENDIENTE' && estadoActual === 'ENVIADO') {
            throw new CambioEstadoInvalidoError('El pedido ya fue enviado')
        }

        if (nuevoEstado === 'ENTREGADO' && estadoActual === 'CANCELADO') {
            throw new CambioEstadoInvalidoError('El pedido ya fue cancelado')
        }
    }
}


function pedidoErrorHandler(err, req, res, next) {

    console.log(err)

    if (err.constructor.name === PedidoNoEncontradoError.name) {
        return res.status(400).json({ message: err.message })
    }

    if (err.constructor.name === CambioEstadoInvalidoError.name) {
        return res.status(400).json({ message: err.message })
    }

    if (err.constructor.name === PermisoDenegadoError.name) {
        return res.status(400).json({ message: err.message })
    }

    if (err.constructor.name === UsuarioNoEncontradoError.name) {
        return res.status(404).json({ message: err.message })
    }

    if (err.constructor.name === ProductoNoEncontradoError.name) {
        return res.status(404).json({ message: err.message })
    }

    if (err.constructor.name === PedidoNoCreadoError.name) {
        return res.status(400).json({ message: err.message })
    }

    if (err.constructor.name === PedidoBadRequestError.name) {
        return res.status(400).json({ message: err.message, errors: err.errors })
    }

    return res.status(500).json({ message: "Error interno del servidor" })

}

export { pedidoErrorHandler, PedidoHandler }