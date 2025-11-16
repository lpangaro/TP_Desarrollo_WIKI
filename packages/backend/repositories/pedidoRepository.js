import { PedidoModel } from "../schemas/pedidoSchema.js";
import mongoose from "mongoose";

class PedidoRepository {

    constructor() {
        this.model = PedidoModel
    }

    save(pedido) {
        const ped = new this.model(pedido)
        return ped.save()
    }

    getAll(page, limit) {
        // Calcular cuántos documentos saltar
        const skip = (page - 1) * limit;
        return this.model.find().skip(skip).limit(limit);

    }

    findById(id) {
        return this.model.findById(id)
    }

    findHistoryByUser(id) {
        return this.model.find({ comprador: id }).lean()
            .then(pedidos => {
                return pedidos.flatMap(pedido => pedido.historialEstados || [])
            })
    }

    update(pedido) {
        console.log("pedido._id", pedido._id)
        return this.model.findByIdAndUpdate(pedido._id, pedido, { new: true })
    }

    getPedidosByVendedor(id, page, limit) {
        const vendedorObjectId = new mongoose.Types.ObjectId(id);
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        return this.model.aggregate([
            // 1️⃣ Unir productos con los items de los pedidos
            {
                $lookup: {
                    from: "productos",
                    localField: "items.producto",
                    foreignField: "_id",
                    as: "productosInfo"
                }
            },

            // 2️⃣ Filtrar pedidos que tengan al menos un producto del vendedor
            {
                $match: {
                    "productosInfo.vendedor": vendedorObjectId
                }
            },

            // 3️⃣ Populear comprador desde la colección de usuarios
            {
                $lookup: {
                    from: "usuarios",
                    localField: "comprador",
                    foreignField: "_id",
                    as: "compradorInfo"
                }
            },
            {
                $unwind: {
                    path: "$compradorInfo",
                    preserveNullAndEmptyArrays: true
                }
            },

            // 4️⃣ Filtrar items dentro del pedido solo del vendedor actual y proyectar campos
            {
                $project: {
                    _id: 1,
                    estado: 1, // ✅ incluir el campo estado del pedido
                    comprador: {
                        _id: "$compradorInfo._id",
                        nombre: "$compradorInfo.nombre",
                        email: "$compradorInfo.email"
                        // password queda excluido
                    },
                    direccionEntrega: 1,
                    historialEstados: 1,
                    items: {
                        $filter: {
                            input: "$items",
                            as: "item",
                            cond: {
                                $in: [
                                    "$$item.producto",
                                    {
                                        $map: {
                                            input: {
                                                $filter: {
                                                    input: "$productosInfo",
                                                    as: "p",
                                                    cond: { $eq: ["$$p.vendedor", vendedorObjectId] }
                                                }
                                            },
                                            as: "p",
                                            in: "$$p._id"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },

            // 5️⃣ Paginación
            { $skip: skip },
            { $limit: limit }
        ]);


    }

}

export { PedidoRepository }
