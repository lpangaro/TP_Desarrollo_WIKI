import { Router } from "express"
import { UsuarioController } from "../controllers/usuarioController.js"
import { usuarioErrorHandler } from "../handlers/UsuarioHandler.js"
import { ENDPOINTS, SUB_ROUTES, COMPOSED_ROUTES } from "../constants/endpoints.js"

function userRouter(getController) {

    const router = Router()


    /**
     * @swagger
     * /usuarios:
     *   post:
     *     summary: Crea un nuevo usuario
     *     tags: [Usuarios]
     *     requestBody:
     *       required: true
     *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               tipo:
 *                 type: array
 *              
 *             example:
 *               nombre: "Juan"
 *               email: "juan@hotmail.com"
 *               telefono: "123456789"
 *               tipo: "VENDEDOR"
 *     responses:
 *       201:
 *         description: Usuario creado
*/
    router.post(ENDPOINTS.USUARIOS, (req, res, next) => {
        getController(UsuarioController).create(req, res)
            .then(response => {
                return res.status(201).json(response)
            })
            .catch(error => {
                next(error)
            })
    })


    /**
     * @swagger
     * /usuarios:
     *   get:
     *     summary: Obtiene todos los usuarios
     *     tags: [Usuarios]
     *     responses:
     *       200:
     *         description: Lista de usuarios
     */
    router.get(ENDPOINTS.USUARIOS, (req, res, next) => {
        getController(UsuarioController).findAll(req, res)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                next(error)
            })
    })


    /**
     * @swagger
     * /usuarios/{id}:
     *   get:
     *     summary: Obtiene un usuario por su id
     *     tags: [Usuarios]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Usuario encontrado
     *       404:
     *         description: Usuario no encontrado
     */
    router.get(COMPOSED_ROUTES.USUARIO_BY_ID, (req, res, next) => {
        getController(UsuarioController).find(req, res)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(error => {
                next(error)
            })
    })

    /**
     * @swagger
     * /usuarios/{usuarioId}/notificaciones:
     *   get:
     *     summary: Obtiene notificaciones de un usuario, filtrando por cualquier atributo vía query params
     *     tags: [Usuarios]
     *     parameters:
     *       - in: path
     *         name: usuarioId
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: leida
     *         required: false
     *         schema:
     *           type: boolean
     *         description: Filtra por notificaciones leídas (true) o no leídas (false)
     *       - in: query
     *         name: fechaAlta
     *         required: false
     *         schema:
     *           type: string
     *           format: date-time
     *         description: Filtra por fecha de alta
     *       - in: query
     *         name: mensaje
     *         required: false
     *         schema:
     *           type: string
     *         description: Filtra por mensaje
     *     responses:
     *       200:
     *         description: Lista de notificaciones filtradas
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Notificacion'
     */
    router.get(COMPOSED_ROUTES.USUARIO_NOTIFICACIONES, (req, res, next) => {
        getController(UsuarioController).getNotificaciones(req, res)
            .then(response => {
                return res.status(200).json(response)
            }).catch(error => { next(error) })
    })

    /**
    * @swagger
    * /usuarios/login:
    *   post:
    *     summary: Inicia sesión de usuario y devuelve un token de autenticación
    *     tags: [Usuarios]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - email
    *               - password
    *             properties:
    *               email:
    *                 type: string
    *                 format: email
    *                 example: usuario@ejemplo.com
    *               password:
    *                 type: string
    *                 format: password
    *                 example: "123456"
    *     responses:
    *       200:
    *         description: Login exitoso, devuelve el token JWT
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 token:
    *                   type: string
    *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    *       401:
    *         description: Credenciales inválidas
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message:
    *                   type: string
    *                   example: "Usuario y/o contraseña incorrectos"
    */
    router.post(COMPOSED_ROUTES.USUARIO_LOGIN, (req, res, next) => {
        getController(UsuarioController).login(req, res)
            .then(response => {
                return res.status(200).json(response)
            }).catch(error => { next(error) })
    })
    router.use(usuarioErrorHandler)
    return router
}

export { userRouter }