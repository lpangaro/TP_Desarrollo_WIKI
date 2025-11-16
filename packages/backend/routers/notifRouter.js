import { Router } from 'express'
import { NotificacionController } from '../controllers/notificacionController.js'
import { notificacionErrorHandler } from '../handlers/NotificacionHandler.js'
import { ENDPOINTS, COMPOSED_ROUTES } from '../constants/endpoints.js'

function notifRouter(getController) {

    const router = Router()

    /**
     * @swagger
     * /notificaciones:
     *   get:
     *     summary: Obtiene todas las notificaciones
     *     tags: [Notificaciones]
     *     responses:
     *       200:
     *         description: Lista de notificaciones
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Notificacion'
     */
    router.get(ENDPOINTS.NOTIFICACIONES, (req, res, next) => {
        getController(NotificacionController).getAll(req, res)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => { next(error) })
    })

    /**
     * @swagger
     * /notificaciones:
     *   post:
     *     summary: Crea una nueva notificación
     *     tags: [Notificaciones]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               usuarioDestino:
     *                 type: string
     *                 example: "652f1a2b3c4d5e6f7g8h9i0j"
     *               mensaje:
     *                 type: string
     *                 example: "Tu pedido fue despachado"
     *     responses:
     *       201:
     *         description: Notificación creada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Notificacion'
     */
    router.post(ENDPOINTS.NOTIFICACIONES, (req, res, next) => {
        getController(NotificacionController).create(req, res)
            .then(response => {
                return res.status(201).json(response)
            })
            .catch(error => { next(error) })
    })







    /**
     * @swagger
     * /notificaciones/{id}:
     *   patch:
     *     summary: Actualiza una notificación (puede marcar como leída y modificar otros campos)
     *     tags: [Notificaciones]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               leida:
     *                 type: boolean
     *                 description: Si la notificación fue leída
     *               mensaje:
     *                 type: string
     *               fechaLeida:
     *                 type: string
     *                 format: date-time
     *     responses:
     *       200:
     *         description: Notificación actualizada
     *       404:
     *         description: Notificación no encontrada
     */
    router.patch(COMPOSED_ROUTES.NOTIFICACION_BY_ID, (req, res, next) => {
        getController(NotificacionController).update(req, res)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                next(error)
            })
    })

    router.use(notificacionErrorHandler)
    return router


}

export { notifRouter }