import { pedidoSchema, idTransform } from "../validators/validators.js";
import { EstadoPedido } from "../domain/pedidos/enum_estados.js"
import { PedidoBadRequestError } from '../errors/pedidosErrors/PedidoBadRequestError.js';
import { bodySchema } from '../validators/validators.js';

class PedidoController {

    constructor(pedidoService) {
        this.service = pedidoService
    }

    update(req, res) {
        // Validar
        const resultId = idTransform.safeParse(req.params.id);
        const parseBody = bodySchema.safeParse(req.body)

        if (!resultId.success || !parseBody.success) {
            //junto los errores
            const errores = resultId.error?.issues.concat(parseBody.error.issues)
            throw new PedidoBadRequestError(errores);
        }

        const id = resultId.data;

        // Normalizar estado a valor del enum
        const rawEstado = parseBody.data.estado
        const motivo = parseBody.data.motivo

        let nuevoEstado = null
        const keyMatch = Object.keys(EstadoPedido).find(k => k.toLowerCase() === String(rawEstado).toLowerCase())
        if (keyMatch) {
            nuevoEstado = EstadoPedido[keyMatch]
        } else {
            const valMatch = Object.values(EstadoPedido).find(v => String(v).toLowerCase() === String(rawEstado).toLowerCase())
            if (valMatch) nuevoEstado = valMatch
        }

        if (!nuevoEstado) {
            return res.status(400).json({ error: 'estado inválido', allowed: Object.values(EstadoPedido) })
        }

        return this.service.update(id, nuevoEstado, motivo)
    }

    create(req, res) {
        const parsed = pedidoSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new PedidoBadRequestError(parsed.error.issues);
        }
        return this.service.create(parsed.data)
    }

    findAll(req, res) {
        return this.service.getAll(req.query)
    }

    findById(req, res) {
        const resultId = idTransform.safeParse(req.params.id);
        if (!resultId.success) {
            throw new PedidoBadRequestError(resultId.error.issues)
        }
        return this.service.findById(resultId.data)
    }

    findHistoryByUser(req, res) {
        const resultId = idTransform.safeParse(req.params.idUser);
        if (!resultId.success) {
            throw new PedidoBadRequestError(resultId.error.issues);
        }
        return this.service.findHistoryByUser(req.params.idUser)
    }

    getPedidosByVendedor(req, res) {
        const resultId = idTransform.safeParse(req.params.vendedorId);
        if (!resultId.success) {
            throw new PedidoBadRequestError(resultId.error.issues);
        }
        return this.service.getPedidosByVendedor(req)
    }
}

export function errorServidor(res, error) {
    return res.status(500).json({ error: "Error interno del servidor", details: error.message });
}



export { PedidoController }