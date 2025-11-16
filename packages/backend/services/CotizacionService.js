import axios from 'axios';

class CotizacionService {
    constructor(repositoryCotizacion) {
        this.repositoryCotizacion = repositoryCotizacion;
    }

    static MONEDA_BASE = 'ARS';
    static API_KEY = '1c5c3d141c128a8f29f161dc';

    /**
     * Obtiene la cotización entre dos monedas
     */
    async obtenerCotizacion(monedaOrigen, monedaDestino) {
        if (monedaOrigen === monedaDestino) {
            return 1;
        }

        try {
            // Buscar en caché
            const cotizacionCache = await this.repositoryCotizacion.findByMonedas(
                monedaOrigen, 
                monedaDestino
            );

            if (cotizacionCache && new Date(cotizacionCache.expiraEn) > new Date()) {
                console.log(`Cotización ${monedaOrigen}->${monedaDestino} encontrada en caché`);
                return cotizacionCache.tasaCambio;
            }

            // Consultar API externa
            console.log(`Consultando API para ${monedaOrigen}->${monedaDestino}`);
            const tasaCambio = await this.consultarAPIExterna(monedaOrigen, monedaDestino);

            // Guardar/actualizar en caché
            await this.repositoryCotizacion.saveOrUpdate({
                monedaOrigen,
                monedaDestino,
                tasaCambio,
                fechaActualizacion: new Date(),
                expiraEn: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
            });

            return tasaCambio;
        } catch (error) {
            console.error('Error obteniendo cotización:', error);
            throw new Error('No se pudo obtener la cotización');
        }
    }

    /**
     * Consulta API externa de cotizaciones usando exchangerate-api.com
     */
    async consultarAPIExterna(monedaOrigen, monedaDestino) {
        try {
            // Usar API con tu API Key
            const response = await axios.get(
                `https://v6.exchangerate-api.com/v6/${CotizacionService.API_KEY}/latest/${monedaOrigen}`
            );
            
            if (response.data.result !== 'success') {
                throw new Error(`Error en la API: ${response.data['error-type']}`);
            }
            
            const tasa = response.data.conversion_rates[monedaDestino];
            
            if (!tasa) {
                throw new Error(`No se encontró tasa para ${monedaDestino}`);
            }
            
            return tasa;
        } catch (error) {
            console.error('Error consultando API externa:', error);
            // Fallback: usar cotizaciones predeterminadas
            return this.obtenerCotizacionFallback(monedaOrigen, monedaDestino);
        }
    }

    /**
     * Cotizaciones de fallback (solo para desarrollo/emergencia)
     */
    obtenerCotizacionFallback(monedaOrigen, monedaDestino) {
        const tasasFallback = {
            'USD-ARS': 1000,
            'ARS-USD': 0.001,
            'USD-BRL': 5.0,
            'BRL-USD': 0.2,
            'ARS-BRL': 0.005,
            'BRL-ARS': 200
        };

        const clave = `${monedaOrigen}-${monedaDestino}`;
        return tasasFallback[clave] || 1;
    }

    /**
     * Convierte un monto de una moneda a otra
     */
    async convertir(monto, monedaOrigen, monedaDestino) {
        const tasaCambio = await this.obtenerCotizacion(monedaOrigen, monedaDestino);
        return parseFloat((monto * tasaCambio).toFixed(2));
    }

    /**
     * Obtiene todas las cotizaciones actuales (solo ARS, USD, BRL)
     */
    async obtenerTodasLasCotizaciones() {
        const monedas = ['ARS', 'USD', 'BRL'];
        const cotizaciones = {};

        for (const origen of monedas) {
            cotizaciones[origen] = {};
            for (const destino of monedas) {
                if (origen !== destino) {
                    cotizaciones[origen][destino] = await this.obtenerCotizacion(origen, destino);
                }
            }
        }

        return cotizaciones;
    }
}

export { CotizacionService };