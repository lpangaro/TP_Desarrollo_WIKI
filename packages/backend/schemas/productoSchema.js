import mongoose from "mongoose";
import { Producto } from "../domain/productos/Producto.js";

const ProductoSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios", required: false },
    vendedor: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios", required: true },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    categorias: { type: [String], required: true },
    precio: { type: Number, required: true },
    moneda: { type: String, enum: ["PESO_ARG", "DOLAR", "REAL"], required: true },
    stock: { type: Number, required: true },
    fotos: { type: [String], required: false, default: [] },
    activo: { type: Boolean, required: false, default: true },
    cantVendido: { type: Number, required: false, default: 0 }
}, { collection: "productos", versionKey: false })


//cuando haga un "find", en vez de devolver el objectId en el atributo "vendedor" va a devolver el documento correspondiente a ese id
ProductoSchema.pre(/^find/, function (next) {
    this.populate('vendedor');
    next();
});


ProductoSchema.loadClass(Producto)
const ProductoModel = mongoose.model("productos", ProductoSchema)

export { ProductoModel, ProductoSchema }













