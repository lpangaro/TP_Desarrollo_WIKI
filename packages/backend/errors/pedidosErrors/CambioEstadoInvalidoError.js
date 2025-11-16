export class CambioEstadoInvalidoError extends Error {
    constructor(message) {
        super();
        this.name = 'CambioEstadoInvalidoError'
        this.message = message;
    }
}