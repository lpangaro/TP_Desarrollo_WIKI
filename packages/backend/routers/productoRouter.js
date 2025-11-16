import { Router } from 'express'
import { ProductoController } from '../controllers/productoController.js'
import { productErrorHandler } from '../handlers/ProductHandler.js'
import { ENDPOINTS, COMPOSED_ROUTES } from '../constants/endpoints.js'

export function productoRouter(getController) {

    const router = Router()


    /**
     * @swagger
  * /productos:
    *   get:
    *     summary: Obtiene todos los productos con paginación, filtrado por precio y opciones de ordenamiento
    *     tags: [Productos]
    *     parameters:
    *       - in: query
    *         name: page
    *         description: Número de página para la paginación (por defecto 1)
    *         schema:
    *           type: integer
    *           default: 1
    *       - in: query
    *         name: limit
    *         description: Número máximo de productos por página (por defecto 10)
    *         schema:
    *           type: integer
    *           default: 10
    *       - in: query
    *         name: minPrice
    *         description: Precio mínimo para filtrar los productos
    *         schema:
    *           type: integer
    *           default: 0
    *       - in: query
    *         name: maxPrice
    *         description: Precio máximo para filtrar los productos
    *         schema:
    *           type: integer
    *           default: 100000
    *       - in: query
    *         name: precio
    *         description: Ordenar productos por precio (ascendente o descendente)
    *         schema:
    *           type: string
    *           enum: [asc, desc]
    *           example: asc
    *       - in: query
    *         name: orden
    *         description: Ordenar productos por otros criterios (por ahora "mas vendido")
    *         schema:
    *           type: string
    *           enum: [mas vendido]
    *           example: mas vendido
    *     responses:
    *       200:
    *         description: Lista de productos ordenados y filtrados
    */

    router.get(ENDPOINTS.PRODUCTOS, (req, res, next) => {
        getController(ProductoController).findAll(req, res)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                next(error)
            })
    })


    /**
     * @swagger
     * /productos/vendedor/{vendedorId}:
     *   get:
     *     summary: Obtiene productos de un vendedor con filtros, paginación y ordenamiento
     *     tags: [Productos]
     *     parameters:
     *       - in: path
     *         name: vendedorId
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: titulo
     *         schema:
     *           type: string
     *       - in: query
     *         name: categoria
     *         schema:
     *           type: string
     *       - in: query
     *         name: precio
     *         required: false
     *         description: Ordenar por precio ascendente o descendente
     *         schema:
     *            type: string
     *            enum: [asc, desc]
     *       - in: query
     *         name: orden
     *         required: false
     *         description: Ordenar por producto mas vendido
     *         schema:
     *            type: string
     *            enum: ["mas vendido"]
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Lista de productos filtrados
     */
    router.get(COMPOSED_ROUTES.PRODUCTO_BY_VENDEDOR, (req, res, next) => {
        getController(ProductoController).findProductsByUser(req, res)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                next(error)
            })
    })

    /**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vendedor:
 *                 type: string
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               categorias:
 *                 type: array
 *                 items:
 *                   type: string
 *               precio:
 *                 type: number
 *               moneda:
 *                 type: string
 *               stock:
 *                 type: integer
 *               fotos:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               vendedor: "68e14466c5ea3ab2fa8f9a3c"
 *               titulo: "Campera de invierno"
 *               descripcion: "Campera impermeable"
 *               categorias: ["Ropa"]
 *               precio: 3000
 *               moneda: "PESO_ARG"
 *               stock: 5
 *               fotos: ["foto1.jpg", "foto5.jpg"]
 *     responses:
 *       201:
 *         description: Producto creado
 */
    router.post(ENDPOINTS.PRODUCTOS, (req, res, next) => {
        getController(ProductoController).create(req, res)
            .then(response => {
                return res.status(201).json(response)
            })
            .catch(error => {
                next(error)
            })
    })


    /**
     * @swagger
     * /productos/{id}:
     *   get:
     *     summary: Obtiene un producto por su id
     *     tags: [Productos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Producto encontrado
     *       404:
     *         description: Producto no encontrado
     */
    router.get(COMPOSED_ROUTES.PRODUCTO_BY_ID, (req, res, next) => {
        getController(ProductoController).findById(req, res)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                next(error)
            })
    })

    router.use(productErrorHandler)
    return router
}


