import Cotizacion from '../schemas/cotizacionSchema.js';

class CotizacionRepository {
    
    async findByMonedas(monedaOrigen, monedaDestino) {
        try {
            const cotizacion = await Cotizacion.findOne({
                monedaOrigen,
                monedaDestino,
                expiraEn: { $gt: new Date() }
            });

            return cotizacion;
        } catch (error) {
            console.error('Error buscando cotización:', error);
            throw error;
        }
    }

    async saveOrUpdate(cotizacionData) {
        try {
            return await Cotizacion.findOneAndUpdate(
                { 
                    monedaOrigen: cotizacionData.monedaOrigen,
                    monedaDestino: cotizacionData.monedaDestino 
                },
                cotizacionData,
                { upsert: true, new: true }
            );
        } catch (error) {
            console.error('Error guardando cotización:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            return await Cotizacion.find({ expiraEn: { $gt: new Date() } });
        } catch (error) {
            console.error('Error obteniendo cotizaciones:', error);
            throw error;
        }
    }
}

export { CotizacionRepository };
