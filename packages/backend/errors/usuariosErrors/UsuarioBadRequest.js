export class UsuarioBadRequest extends Error {
    constructor(issues = []) {
        super("Error en los datos enviados");
        this.name = "UsuarioBadRequest";
        this.errors = issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));
    }
}