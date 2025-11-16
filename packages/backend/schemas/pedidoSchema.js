import mongoose from "mongoose";
import { Pedido } from "../domain/pedidos/Pedido.js"
import { DireccionDeEntrega } from "../domain/pedidos/DireccionDeEntrega.js";

const DireccionSchema = new mongoose.Schema({
    calle: { type: String, required: true },
    altura: { type: String, required: true },
    departamento: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    ciudad: { type: String, required: true },
    provincia: { type: String, required: true },
    pais: { type: String, required: true },
    lat: { type: String, required: true },
    lon: { type: String, required: true },
}, { _id: false })

const CambioEstadoPedidoSchema = new mongoose.Schema({
    fecha: { type: Date, required: true },
    nuevoEstado: { type: String, required: true },
    pedido: { type: mongoose.Schema.Types.ObjectId, ref: "pedidos", required: false },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios", required: false },
    motivo: { type: String, required: false }
}, { _id: false, versionKey: false })

const ItemPedidoSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: "productos", required: true },
    cantidad: { type: Number, required: true },
    precioUnitario: { type: Number, required: true }
}, { _id: false, versionKey: false })



const PedidoSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios", required: false },
    comprador: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios", required: true },
    items: { type: [ItemPedidoSchema], required: true },
    total: { type: Number, required: false },
    moneda: { type: String, enum: ["PESO_ARG", "DOLAR", "REAL"], required: true },
    direccionEntrega: { type: DireccionSchema, required: true },
    estado: { type: String, enum: ["Pendiente", "Confirmado", "En Preparación", "Enviado", "Cancelado", "Entregado"], required: false },
    fecha: { type: Date, required: false },
    historialEstados: { type: [CambioEstadoPedidoSchema], required: false }
}, { collection: "pedidos", versionKey: false })


DireccionSchema.loadClass(DireccionDeEntrega)

//populo el atributo "comprador"
PedidoSchema.pre(/^find/, function (next) {
    this.populate('comprador')
    this.populate('items.producto')
    next()
})

CambioEstadoPedidoSchema.pre(/^find/, function (next) {
    this.populate('usuario')
    next()
})



PedidoSchema.loadClass(Pedido)

//guardo en la coleccion "pedidos"
const PedidoModel = mongoose.model("pedidos", PedidoSchema)

export { PedidoModel }














