import dotenv from 'dotenv'
import express from "express";
import cors from "cors";
import { setupSwagger } from './swagger.js'

import { PedidoRepository } from './repositories/pedidoRepository.js'
import { PedidoService } from './services/pedidoService.js'
import { PedidoController } from './controllers/pedidoController.js'
import { pedidosRouter } from "./routers/pedidoRouter.js";
import { Server } from './server.js'
import { routers } from './routers/routers.js';
import { UsuarioRepository } from './repositories/usuarioRepository.js'
import { UsuarioService } from './services/usuarioService.js'
import { UsuarioController } from './controllers/usuarioController.js';
import { ProductoRepository } from './repositories/productoRepository.js'
import { ProductoService } from './services/productoService.js'
import { ProductoController } from './controllers/productoController.js'
import { NotificacionRepository } from './repositories/notificacionRepository.js';
import { NotificacionService } from './services/notificacionService.js';
import { NotificacionController } from './controllers/notificacionController.js';
import { HealthCheckController } from './controllers/healthCheckController.js';
import { CotizacionRepository } from './repositories/cotizacionRepository.js';
import { CotizacionService } from './services/cotizacionService.js';
import { CotizacionController } from './controllers/cotizacionController.js';

//cargo las variables de entorno
dotenv.config()

//leo el puerto que está configurado en el .env
const port = process.env.SERVER_PORT


const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

// Swagger docs
setupSwagger(app)




//repositorios
const repoPedidos = new PedidoRepository();
const repoUsuarios = new UsuarioRepository();
const repoProductos = new ProductoRepository();
const repoNotif = new NotificacionRepository();
const repoCotizaciones = new CotizacionRepository();

const notifService = new NotificacionService(repoNotif)
const usuarioService = new UsuarioService(repoUsuarios, notifService)
const productoService = new ProductoService(repoProductos, usuarioService)
const cotizacionService = new CotizacionService(repoCotizaciones)
const pedidoService = new PedidoService(repoPedidos)

//inyecto dependencias
pedidoService.inyectarDependencias(usuarioService, productoService, notifService, cotizacionService)

const userController = new UsuarioController(usuarioService)
const productoController = new ProductoController(productoService)
const notifController = new NotificacionController(notifService)
const pedidosController = new PedidoController(pedidoService)
const healthCheckController = new HealthCheckController()
const cotizacionController = new CotizacionController(cotizacionService)

//creo el server
const server = new Server(app, port);

//registro los controladores
server.setController(UsuarioController, userController)
server.setController(PedidoController, pedidosController)
server.setController(ProductoController, productoController)
server.setController(NotificacionController, notifController)
server.setController(HealthCheckController, healthCheckController)
server.setController(CotizacionController, cotizacionController)

//configuro las rutas
routers.forEach(route => server.addRoute(route))
server.configureRoutes();

//pongo a correr el server
server.launch()



