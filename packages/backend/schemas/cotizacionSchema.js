import mongoose from "mongoose";

const cotizacionSchema = new mongoose.Schema({
    monedaOrigen: {
        type: String,
        required: true,
        enum: ['ARS', 'USD', 'BRL']
    },
    monedaDestino: {
        type: String,
        required: true,
        enum: ['ARS', 'USD', 'BRL']
    },
    tasaCambio: {
        type: Number,
        required: true
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    },
    // Tiempo de vida del caché (24 horas por defecto)
    expiraEn: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
}, {
    timestamps: true
});

// Índice compuesto para búsquedas rápidas
cotizacionSchema.index({ monedaOrigen: 1, monedaDestino: 1 });

const Cotizacion = mongoose.model('Cotizacion', cotizacionSchema);

export default Cotizacion;