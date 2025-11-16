import { Usuario } from "../domain/usuarios/Usuario.js";
import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios", required: false },
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    telefono: { type: String, required: true },
    tipo: { type: String, enum: ["VENDEDOR", "COMPRADOR"], required: true },
    fechaAlta: { type: Date, required: false }
}, { collection: "usuarios", versionKey: false })

UsuarioSchema.loadClass(Usuario)

const UsuarioModel = mongoose.model("usuarios", UsuarioSchema)

export { UsuarioModel, UsuarioSchema }














