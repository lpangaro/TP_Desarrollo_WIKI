import { Router } from "express"
import { HealthCheckController } from "../controllers/healthCheckController.js"
import { ENDPOINTS } from "../constants/endpoints.js"

function healthCheckRouter(getController) {

    const router = Router()


    /**
     * @swagger
     * /health-check:
     *   get:
     *     summary: Verifica el estado de salud del servidor
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: OK
     */
    router.get(ENDPOINTS.HEALTH_CHECK, (req, res) => {
        return getController(HealthCheckController).healthCheck(req, res)
    })

    return router
}

export { healthCheckRouter }