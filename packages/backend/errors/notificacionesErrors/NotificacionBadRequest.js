export class NotificacionBadRequestError extends Error {
    constructor(issues = []) {
        super("Error en los datos de la notificación");
        this.name = "NotificacionBadRequestError";
        this.errors = issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));
    }
}
