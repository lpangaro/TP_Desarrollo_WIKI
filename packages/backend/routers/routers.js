import { pedidosRouter } from "./pedidoRouter.js"
import { userRouter } from "./userRouter.js"
import { productoRouter } from "./productoRouter.js"
import { notifRouter } from './notifRouter.js'
import { healthCheckRouter } from './healthCheckRouter.js'
import { cotizacionRouter } from './cotizacionRoutes.js'

const routers = [
    userRouter,
    pedidosRouter,
    productoRouter,
    notifRouter,
    healthCheckRouter,
    cotizacionRouter
]

export { routers }