import { usuarioSchema } from '../validators/validators.js';
import { idTransform } from '../validators/validators.js';
import { UsuarioBadRequest } from '../errors/usuariosErrors/UsuarioBadRequest.js';

class UsuarioController {

    constructor(usuarioService) {
        this.service = usuarioService
    }

    create(req, res) {
        const parsed = usuarioSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new UsuarioBadRequest(parsed.error.issues);
        }
        return this.service.createUser(parsed.data)
    }

    findAll(req, res) {
        return this.service.findAll()
    }

    find(req, res) {
        const resultId = idTransform.safeParse(req.params.id);
        if (!resultId.success) {
            throw new UsuarioBadRequest(resultId.error.issues);
        }
        return this.service.find(req.params.id)
    }

    getNotificaciones(req, res) {
        //verifico q el id q me manden sea un objectId
        const resultId = idTransform.safeParse(req.params.id);
        if (!resultId.success) {
            throw new UsuarioBadRequest(resultId.error.issues)
        }

        const filtros = {};
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

        return this.service.getNotificaciones(req.params.id, filtros);
    }

    login(req,res) {
        return this.service.login(req.body)
    }
}
export { UsuarioController }