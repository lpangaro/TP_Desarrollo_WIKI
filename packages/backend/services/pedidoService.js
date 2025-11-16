import { FactoryNotificacion } from '../domain/notificacciones/FactoryNotificacion.js'
import { EstadoPedido } from '../domain/pedidos/enum_estados.js'
import { UsuarioNoEncontradoError } from '../errors/usuariosErrors/UsuarioNoEncontradoError.js'
import { ProductoNoEncontradoError } from '../errors/productosErrors/ProductoNoEncontradoError.js'
import { PermisoDenegadoError } from '../errors/pedidosErrors/PermisoDenegadoError.js'
import { PedidoNoCreadoError } from '../errors/pedidosErrors/PedidoNoCreadoError.js'
import { PedidoNoEncontradoError } from '../errors/pedidosErrors/PedidoNoEncontradoError.js'

import { PedidoHandler } from '../handlers/PedidoHandler.js'

class PedidoService {
    constructor(repositoryPedidos) {
        this.repositoryPedidos = repositoryPedidos
        this.notificador = new FactoryNotificacion()
        this.pedidoHandler = new PedidoHandler();
        // Usar el servicio de notificaciones inyectado (evita instancias múltiples del repo)
    }

    inyectarDependencias(usuarioService, productoService, notifService) {
        this.usuarioService = usuarioService
        this.productoService = productoService,
            this.notificacionService = notifService
    }

    create(pedido) {
        return this.usuarioService.find(pedido.comprador)
            .then(compradorFounded => {
                if (!compradorFounded) {
                    throw new UsuarioNoEncontradoError(pedido.comprador);
                }

                const itemsPromises = pedido.items.map(item => {
                    const prodId = item.producto;
                    return this.productoService.findById(prodId)
                        .then(productoFounded => {
                            if (!productoFounded) {
                                throw new ProductoNoEncontradoError(prodId);
                            }
                            return this.pedidoHandler.crearItemPedido(productoFounded, item.cantidad, productoFounded.precio);
                        });
                });

                return Promise.all(itemsPromises)
                    .then(itemsPedidos => {
                        // Verificar stock y procesar ventas
                        const productosAActualizar = [];
                        itemsPedidos.forEach(item => {
                            if (!item.stockSuficiente()) {
                                throw new Error(`Stock insuficiente para el producto ${item.producto.id}`);
                            }
                            const productoActualizado = item.vender(); // Actualiza stock y ventas
                            productosAActualizar.push(productoActualizado);
                        });

                        // Persistir cambios de productos en la base de datos
                        const updatePromises = productosAActualizar.map(producto =>
                            this.productoService.update(producto)
                        );

                        return Promise.all(updatePromises)
                            .then(() => {
                                const direccionDeEntrega = this.pedidoHandler.crearDireccionEntrega(pedido.direccionEntrega);
                                const nuevoPedido = this.pedidoHandler.crearPedido(compradorFounded, itemsPedidos, pedido.moneda, direccionDeEntrega);
                                return this.repositoryPedidos.save(nuevoPedido);
                            });
                    });
            })
            .then(pedidoGuardado => {
                const notificacion = this.notificador.crearNotificacionPedidoCreado(pedidoGuardado);
                return this.notificacionService.create(notificacion)
                    .then(() => pedidoGuardado);
            })
            .catch(error => { //WARNING: PARECE QUE ESTO SALE CUANDO LA CANTIDAD DEL PEDIDO ES >1/2 DEL STOCK (mas de la mitad pero menos del total)
                throw new PedidoNoCreadoError(error.message);
            });
    }

    getAll(paginacion) {
        const { page, limit } = paginacion
        //hago esto para evitar que me pasen "page=asd o cualquier string"
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;

        return this.repositoryPedidos.getAll(pageNum, limitNum)
    }

    findById(id) {
        return this.repositoryPedidos.findById(id)
    }

    findHistoryByUser(id) {
        return this.repositoryPedidos.findHistoryByUser(id);
    }

    update(id, nuevoEstado, motivo) {
        return this.repositoryPedidos.findById(id)
            .then(pedido => {
                if (!pedido) {
                    throw new PedidoNoEncontradoError(id);
                }
                this.pedidoHandler.validarCambioEstado(pedido, nuevoEstado);
                return this.actualizarPedidoYNotificar(pedido, nuevoEstado, null, motivo);
            });
    }

    actualizarPedidoYNotificar(pedido, nuevoEstado, vendedor, motivo) {
        pedido.actualizarEstado(nuevoEstado, vendedor, motivo);
        return this.repositoryPedidos.update(pedido)
            .then(pedidoActualizado => {
                let notificacion = null;
                if (nuevoEstado === EstadoPedido.ENVIADO) {
                    notificacion = this.notificador.crearNotificacionPedidoEnviado(pedidoActualizado);
                } else if (nuevoEstado === EstadoPedido.CANCELADO) {
                    notificacion = this.notificador.crearNotificacionPedidoCancelado(pedidoActualizado);
                }
                if (notificacion) {
                    return this.notificacionService.create(notificacion)
                        .then(() => pedidoActualizado);
                }
                return pedidoActualizado;
            })
    }

    getPedidosByVendedor(req) {
        const { page = 1, limit = 10 } = req.query
        return this.repositoryPedidos.getPedidosByVendedor(req.params.vendedorId, page, limit)

    }
}
export { PedidoService }

