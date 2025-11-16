import { Notificacion } from "./Notificacion.js";
import { NotificacionService } from "../../services/notificacionService.js";

export class FactoryNotificacion {

    constructor(){
        this.nextId=1
    }

    crearSegunEstadoPedido(estado) {
        return `Tu pedido está ${estado}`
    }

    crearNotificacionPedidoCreado(pedido) {
        // Notificar al vendedor: indicar quién compró, qué productos, total y dirección
        const vendedor = pedido.items[0].producto.vendedor
        const productos = pedido.items.map(i => `${i.cantidad} x ${i.producto.descripcion || i.producto.titulo || i.producto.id}`).join(', ')
        const mensaje = `Nuevo pedido de ${pedido.comprador.nombre}: ${productos}. Total: ${pedido.total}. Entrega en: ${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura}, ${pedido.direccionEntrega.ciudad}`
        const notif = new Notificacion(null, vendedor, mensaje, new Date())
        return notif
    }

    crearNotificacionPedidoEnviado(pedido) {
        // Notificar al comprador
        const comprador = pedido.comprador
        const mensaje = `Tu pedido ${pedido._id} fue marcado como Enviado.`
        const notif = new Notificacion(null, comprador, mensaje, new Date())
        return notif
    }

    crearNotificacionPedidoCancelado(pedido) {
        // Notificar al vendedor
        const vendedor = pedido.items[0].producto.vendedor
        const mensaje = `El pedido ${pedido._id} fue cancelado por el comprador.`
        const notif = new Notificacion(null, vendedor, mensaje, new Date())
        return notif
    }

    crearSegunPedido(pedido) {
        // backward-compat: devolver notificacion simple al vendedor
        return this.crearNotificacionPedidoCreado(pedido)
    }
}