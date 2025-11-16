export class NotificacionNoEncontrada extends Error {
    constructor(id) {
        super()
        this.name = "NotificacionNoEncontrada"
        this.message = "Notificacion con id " + id + " no existe"
    }

}