class UsuarioDoesNotExist extends Error {
    constructor(id) {
        super()
        this.name='UsuarioDoesNotExist'
        this.message = "Usuario con id " + id + "no existe"
    }

}

export { UsuarioDoesNotExist }