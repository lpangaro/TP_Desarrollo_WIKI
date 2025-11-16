import { EstadoPedido } from "./enum_estados.js";
import { Usuario } from "../usuarios/Usuario.js";
import { Pedido } from "./Pedido.js";

export class CambioEstadoPedido {
    constructor(nuevoEstado, pedido, usuario, motivo) {
        this.fecha = new Date();
        this.nuevoEstado = nuevoEstado;

        //solo agrego esos atributos si me los mandan en un cambio de estado, no cuando recien creo el pedido
        if (pedido) {
            this.pedido = pedido._id
        }

        if (usuario) {
            this.usuario = usuario._id;
        }

        if (motivo) {
            this.motivo = motivo;
        }

    }

    toJSON() {
        return {
            fecha: this.fecha,
            nuevoEstado: this.nuevoEstado,
            pedidoId: this.pedido,
            usuario: this.usuario,
            motivo: this.motivo
        }
    }

}