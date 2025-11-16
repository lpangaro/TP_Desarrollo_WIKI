class CotizacionController {
    constructor(cotizacionService) {
        this.service = cotizacionService;
    }

    obtenerCotizaciones(req, res) {
        return this.service.obtenerTodasLasCotizaciones();
    }

    convertirMoneda(req, res) {
        const { monto, monedaOrigen, monedaDestino } = req.query;
        
        if (!monto || !monedaOrigen || !monedaDestino) {
            throw new Error('Faltan parámetros: monto, monedaOrigen, monedaDestino');
        }

        return this.service.convertir(
            parseFloat(monto),
            monedaOrigen,
            monedaDestino
        ).then(montoConvertido => ({
            montoOriginal: parseFloat(monto),
            monedaOrigen,
            montoConvertido,
            monedaDestino
        }));
    }
}

export { CotizacionController };