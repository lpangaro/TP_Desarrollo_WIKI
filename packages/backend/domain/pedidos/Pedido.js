import { Moneda } from "./enum_monedas.js";
import { EstadoPedido } from "./enum_estados.js";
import { CambioEstadoPedido } from "./CambioEstadoPedido.js";

export class Pedido {
    constructor(id, comprador, items, moneda, direccionEntrega) {
        this.id = id;
        this.comprador = comprador;
        this.items = items;
        this.total = this.calcularTotal();
        this.moneda = moneda;
        this.direccionEntrega = direccionEntrega;
        this.estado = EstadoPedido.PENDIENTE;
        this.fechaCreacion = new Date();
        this.historialEstados = [new CambioEstadoPedido(EstadoPedido.PENDIENTE, this, null, null)];
        if (!this.validarStock()) {
            throw new Error('STOCK_INSUFICIENTE')
        }
    }

    calcularTotal() {
        return this.items.reduce((sum, item) => sum + item.subtotal(), 0);
    }

    actualizarEstado(nuevoEstado, quien, motivo) { //nuevoEstado es uno de los enum
        const nuevo = new CambioEstadoPedido(nuevoEstado, this, quien, motivo); //en cambio este es una clase
        this.historialEstados.push(nuevo);
        this.estado = nuevoEstado;
    }

    validarStock() {
        return this.items.every(item => item.stockSuficiente());
    }

}