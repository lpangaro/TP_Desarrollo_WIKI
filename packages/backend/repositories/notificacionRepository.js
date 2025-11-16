import { NotificacionModel } from "../schemas/notificacionSchema.js"

class NotificacionRepository {
    constructor() {
        this.model = NotificacionModel
    }

    findByFilters(filtros = {}) {
        return this.model.find(filtros).lean();
    }

    save(notificacion) {
        const notif = new this.model(notificacion)
        return notif.save()
    }

    getAll() {
        return this.model.find()
    }

    findByUserWithFilter(usuarioId, filter = {}) {
        const query = { usuarioDestino: usuarioId, ...filter }
        return this.model.find(query).lean()
    }

    update(id, body) {
        return this.model.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, lean: true }
        );
    }
}

export { NotificacionRepository }