export class ProductoBadRequestError extends Error {
    constructor(issues = []) {
        super("Error en los datos enviados para el producto");
        this.name = "ProductoBadRequestError";
        this.errors = issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));
    }
}