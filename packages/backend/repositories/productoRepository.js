import { ProductoModel } from "../schemas/productoSchema.js"

class ProductoRepository {
    constructor() {
        this.model = ProductoModel
    }

    save(producto) {
        const nuevoProducto = new this.model(producto)
        return nuevoProducto.save()
    }

    getAll(page, limit, minPrice, maxPrice, titulo, sort, moneda) {
        // Establecer valores predeterminados
        const minPriceNum = minPrice ? Number(minPrice) : 0; // Valor por defecto: 0
        const maxPriceNum = maxPrice ? Number(maxPrice) : 100000; // Valor por defecto: 100000

        // Calcular cuántos documentos saltar
        const skip = (page - 1) * limit;

        // Construir el filtro
        const filter = {};

        // Filtro de precios
        if (minPrice || maxPrice) {
            filter.precio = {
                $gte: minPriceNum,  // Greater than or equal to minPrice
                $lte: maxPriceNum   // Less than or equal to maxPrice
            };
        }

        // Filtro por título (búsqueda case-insensitive)
        if (titulo && titulo.trim() !== "") {
            filter.titulo = { $regex: titulo, $options: "i" };
        }

        // Filtro por moneda
        if (moneda && moneda.trim() !== "") {
            filter.moneda = moneda;
        }

        // Realizar la consulta con paginación y filtros
        return this.model.find(filter).sort(sort).skip(skip).limit(limit);
    }

    findById(id) {
        return this.model.findById(id)
    }

    findProductsByUser(filtros, ordenamiento, page, limit) {
        // Calcular cuántos documentos saltar
        const skip = (page - 1) * limit;

        return this.model
            .find(filtros)
            .sort(ordenamiento)
            .skip(skip)
            .limit(limit);
    }

    update(producto) {
        return this.model.findByIdAndUpdate(
            producto.id || producto._id,
            producto,
            { new: true }
        );
    }
}
export { ProductoRepository }

