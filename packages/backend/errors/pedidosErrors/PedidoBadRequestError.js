export class PedidoBadRequestError extends Error {
    constructor(issues = []) {
        super("Error en los datos del pedido");
        this.name = "PedidoBadRequestError";
        this.errors = issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));
    }
}
