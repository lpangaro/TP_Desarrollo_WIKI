import { Notificacion } from "../domain/notificacciones/Notificacion.js"

class NotificacionService {

    constructor(repoNotif) {
        this.repoNotificaciones = repoNotif
    }

    create(notificacion) {
        const notif = new Notificacion(
            notificacion.id,
            notificacion.usuarioDestino,
            notificacion.mensaje,
            notificacion.fechaAlta)

        return this.repoNotificaciones.save(notif)
    }

    getAll() {
        return this.repoNotificaciones.getAll()
    }

    findByFilters(filtros = {}) {
        return this.repoNotificaciones.findByFilters(filtros)
    }

    update(id, body) {
        return this.repoNotificaciones.update(id, body)
    }
}

export { NotificacionService }