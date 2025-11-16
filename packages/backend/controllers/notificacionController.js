import { idTransform } from "../validators/validators.js"
import { NotificacionBadRequestError } from "../errors/notificacionesErrors/NotificacionBadRequest.js"
import { NotificacionNoEncontrada } from "../errors/notificacionesErrors/NotificacionNoEncontrada.js"

class NotificacionController {
    constructor(notificacionService) {
        this.service = notificacionService
    }

    create(req, res) {
        return this.service.create(req.body)
    }

    getAll(req, res) {
        return this.service.getAll()
    }

    findByUserWithFilter(req, res) {

        //verifico q el id q me manden sea un objectId
        const resultId = idTransform.safeParse(req.params.usuarioId);
        if (!resultId.success) {
            throw new NotificacionBadRequestError(resultId.error.issues)
        }

        const filtros = { usuarioDestino: req.params.usuarioId };
        // Mensaje: substring, case-insensitive
        if (req.query.mensaje) {
            filtros.mensaje = { $regex: req.query.mensaje, $options: 'i' };
        }
        // FechaAlta: rango de día
        if (req.query.fechaAlta) {
            const date = new Date(req.query.fechaAlta);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            filtros.fechaAlta = { $gte: date, $lt: nextDay };
        }
        // Leida: boolean
        if (req.query.leida !== undefined) {
            filtros.leida = req.query.leida === 'true' || req.query.leida === true;
        }
        // Otros filtros directos
        Object.keys(req.query).forEach(key => {
            if (!['mensaje', 'fechaAlta', 'leida'].includes(key)) {
                filtros[key] = req.query[key];
            }
        });

        return this.service.findByFilters(filtros);
    }

    update(req, res) {

        const resultId = idTransform.safeParse(req.params.id);
        if (!resultId.success) {
            throw new NotificacionBadRequestError(resultId.error.issues)
        }

        const body = req.body
        // Si el campo leida se setea a true y no hay fechaLeida, la agrego automáticamente
        if (body.leida === true && !body.fechaLeida) {
            body.fechaLeida = new Date()
        }
        return this.service.update(req.params.id, body)
            .then(updated => {
                if (!updated) {
                    throw new NotificacionNoEncontrada(req.params.id)
                }
                return res.status(200).json(updated)
            })
    }

}

export { NotificacionController }