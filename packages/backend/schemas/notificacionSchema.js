import mongoose from "mongoose";
import { Notificacion } from "../domain/notificacciones/Notificacion.js";

const NotificacionSchema = new mongoose.Schema({
    usuarioDestino: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios" },
    mensaje: { type: String, required: true },
    fechaAlta: { type: Date, required: true },
    leida: { type: Boolean, required: false },
    fechaLeida: { type: Date, required: false }
}, { collection: "notificaciones", versionKey: false })

NotificacionSchema.pre(/^find/, function (next) {
    this.populate('usuarioDestino')
    next()
})

NotificacionSchema.loadClass(Notificacion)

//guardo en la coleccion "notificaciones"
const NotificacionModel = mongoose.model("notificaciones", NotificacionSchema)

export { NotificacionModel }














