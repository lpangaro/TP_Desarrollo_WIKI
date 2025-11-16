import { Router } from "express";
import { CotizacionController } from "../controllers/cotizacionController.js";
import { ENDPOINTS, COMPOSED_ROUTES } from "../constants/endpoints.js";

function cotizacionRouter(getController) {
    const router = Router();

    /**
     * @swagger
     * /cotizaciones:
     *   get:
     *     summary: Obtiene todas las cotizaciones disponibles
     *     tags: [Cotizaciones]
     *     responses:
     *       200:
     *         description: Cotizaciones obtenidas exitosamente
     */
    router.get(ENDPOINTS.COTIZACIONES, (req, res, next) => {
        getController(CotizacionController).obtenerCotizaciones(req, res)
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                next(error);
            });
    });

    /**
     * @swagger
     * /cotizaciones/convertir:
     *   get:
     *     summary: Convierte un monto de una moneda a otra
     *     tags: [Cotizaciones]
     *     parameters:
     *       - in: query
     *         name: monto
     *         required: true
     *         schema:
     *           type: number
     *       - in: query
     *         name: monedaOrigen
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: monedaDestino
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Conversión realizada exitosamente
     */
    router.get(COMPOSED_ROUTES.COTIZACION_CONVERTIR, (req, res, next) => {
        getController(CotizacionController).convertirMoneda(req, res)
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                next(error);
            });
    });

    return router;
}

export { cotizacionRouter };