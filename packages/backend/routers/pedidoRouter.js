import { Router } from 'express'
import { PedidoController } from '../controllers/pedidoController.js'
import { pedidoErrorHandler } from '../handlers/PedidoHandler.js'
import { ENDPOINTS, COMPOSED_ROUTES } from '../constants/endpoints.js'

function pedidosRouter(getController) {

    const router = Router()


    /**
     * @swagger
     * /pedidos:
     *   get:
     *     summary: Obtiene todos los pedidos
     *     tags: [Pedidos]
     *     responses:
     *       200:
     *         description: Lista de pedidos
     */
    router.get(ENDPOINTS.PEDIDOS, (req, res, next) => {
        getController(PedidoController).findAll(req, res)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                next(error)
            })
    })


    /**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Crea un nuevo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comprador:
 *                 type: string
 *                 example: "68e14466c5ea3ab2fa8f9a3c"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto:
 *                       type: string
 *                       example: "68df5901db509474a76a9aa7"
 *                     cantidad:
 *                       type: integer
 *                       example: 2
 *               moneda:
 *                 type: string
 *                 example: "PESO_ARG"
 *               direccionEntrega:
 *                 type: object
 *                 properties:
 *                   calle:
 *                     type: string
 *                     example: "Av. Siempre Viva"
 *                   altura:
 *                     type: string
 *                     example: "742"
 *                   departamento:
 *                     type: string
 *                     example: "A"
 *                   codigoPostal:
 *                     type: string
 *                     example: "1000"
 *                   ciudad:
 *                     type: string
 *                     example: "Buenos Aires"
 *                   provincia:
 *                     type: string
 *                     example: "Buenos Aires"
 *                   pais:
 *                     type: string
 *                     example: "Argentina"
 *                   lat:
 *                     type: string
 *                     example: "-34.6037"
 *                   lon:
 *                     type: string
 *                     example: "-58.3816"
 *             required:
 *               - comprador
 *               - items
 *               - moneda
 *               - direccionEntrega
 *     responses:
 *       201:
 *         description: Pedido creado
 */
    router.post(ENDPOINTS.PEDIDOS, (req, res, next) => {
        getController(PedidoController).create(req, res)
            .then(response => {
                return res.status(201).json(response)
            })
            .catch(error => {
                next(error)
            })
    })

    /**
         * @swagger
         * /pedidos/{idUser}/historial:
         *   get:
         *     summary: Obtiene el historial de pedidos de un usuario
         *     tags: [Pedidos]
         *     parameters:
         *       - in: path
         *         name: idUser
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Historial de pedidos
         */
    router.get(COMPOSED_ROUTES.PEDIDO_HISTORIAL, (req, res, next) => {
        getController(PedidoController).findHistoryByUser(req, res)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                next(error)
            })
    })

    /**
     * @swagger
     * /pedidos/{id}:
     *   get:
     *     summary: Obtiene un pedido por su id
     *     tags: [Pedidos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Pedido encontrado
     *       404:
     *         description: Pedido no encontrado
     */
    router.get(COMPOSED_ROUTES.PEDIDO_BY_ID, (req, res, next) => {
        getController(PedidoController).findById(req, res)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                next(error)
            })
    })





    /**
     * @swagger
     * /pedidos/{id}:
     *   patch:
     *     summary: Actualiza un pedido (por ejemplo, cambio de estado)
     *     tags: [Pedidos]
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
     *     responses:
     *       200:
     *         description: Pedido actualizado
     *       404:
     *         description: Pedido no encontrado
     */
    router.patch(COMPOSED_ROUTES.PEDIDO_BY_ID, (req, res, next) => {
        getController(PedidoController).update(req, res)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                next(error)
            })
    })
    /**
 * @swagger
 * /pedidos/vendedor/{vendedorId}:
 *   get:
 *     summary: Obtiene todos los pedidos que contienen productos de un vendedor específico
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: vendedorId
 *         required: true
 *         description: ID del vendedor del cual se desean obtener los pedidos
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Número de página para paginación (por defecto 1)
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Cantidad de resultados por página (por defecto 10)
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de pedidos encontrados para el vendedor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID del pedido
 *                   comprador:
 *                     type: string
 *                     description: ID del comprador
 *                   direccionEntrega:
 *                     type: object
 *                     description: Dirección de entrega del pedido
 *                   historialEstados:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         estado:
 *                           type: string
 *                         fecha:
 *                           type: string
 *                           format: date-time
 *                   items:
 *                     type: array
 *                     description: Productos del pedido pertenecientes al vendedor
 *                     items:
 *                       type: object
 *                       properties:
 *                         producto:
 *                           type: string
 *                           description: ID del producto
 *                         cantidad:
 *                           type: number
 *                         precioUnitario:
 *                           type: number
 *                         total:
 *                           type: number
 *                         moneda:
 *                           type: string
 *       400:
 *         description: ID de vendedor inválido
 *       404:
 *         description: No se encontraron pedidos para el vendedor
 *       500:
 *         description: Error interno del servidor
 */

    router.get(COMPOSED_ROUTES.PEDIDO_BY_VENDEDOR, (req, res, next) => {
        getController(PedidoController).getPedidosByVendedor(req, res)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                next(error)
            })
    })
    router.use(pedidoErrorHandler)
    return router
}

export { pedidosRouter }