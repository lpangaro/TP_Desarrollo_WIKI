export class PedidoNoCreadoError extends Error {
    constructor(message){
        super()
        this.message=`No se pudo crear el pedido: ${message}`
        this.name=PedidoNoCreadoError
    }
}
