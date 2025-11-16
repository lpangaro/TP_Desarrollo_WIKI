import { Producto } from "../domain/productos/Producto.js"
import { Usuario } from "../domain/usuarios/Usuario.js";
import { TipoUsuario } from "../domain/usuarios/enum_tiposUsuario.js";
import { Categoria } from "../domain/productos/Categoria.js";
import { Moneda } from "../domain/pedidos/enum_monedas.js";
import { UsuarioNoEncontradoError } from "../errors/usuariosErrors/UsuarioNoEncontradoError.js";
import { ProductoNoEncontradoError } from "../errors/productosErrors/ProductoNoEncontradoError.js"
import { ProductosNoExistenError } from "../errors/productosErrors/ProductosNoExistenError.js";
import mongoose from "mongoose";
import { ItemPedido } from "../domain/pedidos/ItemPedido.js";

export class ProductoService {
    constructor(repositoryProductos, serviceUsuarios) {
        this.repositoryProductos = repositoryProductos
        this.serviceUsuarios = serviceUsuarios
    }

    create(producto) {
        // Verificar que el usuario/vendedor exista en el sistema
        return this.serviceUsuarios.find(producto.vendedor)
            .then(user => {
                if (!user) {
                    throw new UsuarioNoEncontradoError(producto.vendedor)
                }
                return this.repositoryProductos.save(producto);
            })
            .catch(error => {
                throw error
            })
    }

    getAll(paginacion) {
        const { page, limit, minPrice, maxPrice, titulo, orden, precio, moneda } = paginacion

        let sort = {};
        if (precio) {
            if (precio === 'asc') sort.precio = 1;
            else if (precio === 'desc') sort.precio = -1;
        }

        if (orden === "mas vendido") {
            sort.cantVendido = -1
        }
        //hago esto para evitar que me pasen "page=asd o cualquier string"
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;

        const minPriceNum = minPrice ? Number(minPrice) : 0; // Si no se pasa minPrice, usar 0
        const maxPriceNum = maxPrice ? Number(maxPrice) : 100000; // Si no se pasa maxPrice, usar 100000

        return this.repositoryProductos.getAll(pageNum, limitNum, minPriceNum, maxPriceNum, titulo, sort, moneda)
            .then(all => {
                if (all.length === 0) {
                    throw new ProductosNoExistenError()
                }
                return all
            })
            .catch(error => {
                throw error
            })
    }

    findById(id) {
        return this.repositoryProductos.findById(id)
            .then(prod => {
                if (!prod) {
                    throw new ProductoNoEncontradoError(id)
                }
                return prod
            })
            .catch(error => {
                throw error
            })
    }

    findProductsByUser(id, filtros) {

        //por defecto, si no me pasan la pagina y el nro limite de documentos por pagina, los valores default van a ser pagina 1 limite 10
        const { titulo, categoria, descripcion, maxPrice, minPrice, precio, orden, page = 1, limit = 10 } = filtros

        //hago esto para evitar que me pasen "page=asd o cualquier string"
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;

        const query = {
            vendedor: new mongoose.Types.ObjectId(id)
        };

        if (titulo) {
            query.titulo = { $regex: titulo, $options: "i" };
        }

        if (categoria) {
            query.categorias = {
                $in: Array.isArray(categoria) ? categoria : [categoria]
            };
        }

        if (descripcion) {
            query.descripcion = { $regex: descripcion, $options: "i" };
        }

        if (minPrice || maxPrice) {
            query.precio = {};

            if (minPrice) {
                query.precio.$gte = Number(minPrice);
            }

            if (maxPrice) {
                query.precio.$lte = Number(maxPrice);
            }
        }

        let sort = {};
        if (precio) {
            if (precio === 'asc') sort.precio = 1;
            else if (precio === 'desc') sort.precio = -1;
        }

        if (orden === "mas vendido") {
            sort.cantVendido = -1
        }

        return this.repositoryProductos.findProductsByUser(query, sort, pageNum, limitNum)

    }

    update(producto) {
        return this.repositoryProductos.update(producto)
            .then(productoActualizado => {
                if (!productoActualizado) {
                    throw new ProductoNoEncontradoError(producto.id || producto._id)
                }
                return productoActualizado
            })
            .catch(error => {
                throw error
            })
    }

    // findProductsByUser(query, sort, paginacion) {
    //     return this.repositoryProductos.findProductsByUser(query, sort, paginacion)
    // }
}


