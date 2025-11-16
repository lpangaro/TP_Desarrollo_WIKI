export class PedidoNoEncontradoError extends Error {
    constructor(id) {
        super();
        this.name='PedidoNoEncontradoError'
        this.message = 'Pedido con id ' + id + ' no existe';
    }
}