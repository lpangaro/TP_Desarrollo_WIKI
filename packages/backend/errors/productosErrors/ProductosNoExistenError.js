export class ProductosNoExistenError extends Error {
    constructor() {
        super()
        this.name = ProductosNoExistenError
        this.message = "No existen productos"
    }
}