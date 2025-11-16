class ProductoNoEncontradoError extends Error {
    constructor(id) {
        super()
        this.name = 'ProductoNoEncontradoError'
        this.message = `El producto con id ${id} no existe`
    }
}

export { ProductoNoEncontradoError }