import { connectDB } from "./database/database.js";

class Server {
    constructor(app, port) {
        this.app = app;
        this.port = port
        this.routes = []
        this.controllers = {} // { PedidoController: new PedidoController() }
        // CORS ya está configurado en index.js, no es necesario duplicarlo aquí
    }

    addRoute(route) {
        this.routes.push(route)
    }

    setController(controllerClass, instanciaDeController) {
        this.controllers[controllerClass.name] = instanciaDeController
    }

    getController(controllerClass) {
        return this.controllers[controllerClass.name];
    }

    configureRoutes() {
        this.routes.forEach(route => this.app.use(route(this.getController.bind(this))))
    }

    launch() {
        this.app.listen(this.port, () => {
            connectDB()
                .then(() => {
                    console.log(`Servidor escuchando en el puerto ${this.port}`)
                })
                .catch(error => {
                    console.error('Error al conectar con la base de datos:', error)
                })
        })
    }

}

export { Server }