import { productoSchema, idTransform } from "../validators/validators.js";
import { errorServidor } from './pedidoController.js';
import { ProductoBadRequestError } from "../errors/productosErrors/ProductoBadRequestError.js";

class ProductoController {

    constructor(productoService) {
        this.service = productoService
    }

    create(req, res) {
        const parsed = productoSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ProductoBadRequestError(parsed.error.issues)
        }
        return this.service.create(parsed.data)
    }

    findAll(req, res) {
        return this.service.getAll(req.query)
    }

    //buscar un producto por su id
    findById(req, res) {
        const resultId = idTransform.safeParse(req.params.id);
        if (resultId.error) {
            throw new ProductoBadRequestError(resultId.error.issues)
        }
        return this.service.findById(req.params.id)
    }

    //buscar productos por vendedor
    findProductsByUser(req, res) {
        const resultId = idTransform.safeParse(req.params.vendedorId);
        if (resultId.error) {
            throw new ProductoBadRequestError(resultId.error.issues)
        }
        return this.service.findProductsByUser(req.params.vendedorId, req.query)
    }
}
export { ProductoController }