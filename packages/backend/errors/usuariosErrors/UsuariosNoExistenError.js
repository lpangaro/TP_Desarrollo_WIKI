export class UsuariosNoExistenError extends Error {
    constructor(){
        super()
        this.name="UsuariosNoExistenError"
        this.message="No existen usuarios"
    }
}