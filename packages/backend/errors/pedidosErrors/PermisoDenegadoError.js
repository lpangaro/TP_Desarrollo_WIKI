export class PermisoDenegadoError extends Error {
    constructor(message) {
        super();
        this.name='PermisoDenegadoError'
        this.message = message;
    }
}