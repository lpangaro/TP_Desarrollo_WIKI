import { Moneda } from "../pedidos/enum_monedas.js";

export class Producto {
    constructor(id, vendedor, descripcion, categoria, precio, moneda, stock, fotos) {
        this.id = id;
        this.vendedor = vendedor;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.precio = precio;
        this.moneda = moneda;
        this.stock = stock;
        this.fotos = fotos;
        this.activo = true;
        this.cantVendido = 0;
    }

    estaDisponible(cantidad) {
        return this.activo && this.stock >= cantidad; //podria tener stock y estar inactivo?
    }

    sumarVenta(cantidad) {
        return this.cantVendido += cantidad
    }

    reducirStock(cantidad) {
        if (this.estaDisponible(cantidad)) {
            this.stock -= cantidad;
        }
    }

    aumentarStock(cantidad) {
        this.stock += cantidad;
    }
}