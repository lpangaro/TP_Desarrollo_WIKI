class UsuarioNoEncontradoError extends Error {
    constructor(id){
        super()
        this.name='UsuarioNoEncontradoError'
        this.message="Usuario con id " + id + " no encontrado"
    }
}

export { UsuarioNoEncontradoError }