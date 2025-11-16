export class CredencialesInvalidasError extends Error {
    constructor() {
        super("Usuario y/o contraseña incorrectos")
        this.name = "CredencialesInvalidasError"
    }
}