export class ItemPedido {
    constructor(producto, cantidad, precioUnitario) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    subtotal() {
        return this.cantidad * this.precioUnitario;
    }

    stockSuficiente() {
        return this.producto.estaDisponible(this.cantidad);
    }

    vender() {
        // Solo actualiza los valores en memoria
        this.producto.reducirStock(this.cantidad);
        this.producto.sumarVenta(this.cantidad);
        return this.producto;
    }
}