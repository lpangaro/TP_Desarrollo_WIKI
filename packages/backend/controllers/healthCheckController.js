class HealthCheckController {
    constructor() {
        // Constructor vacío - no necesita dependencias
    }

    healthCheck(req, res) {
        res.status(200).json({
            status: 'OK',
            message: '✅ todo ok perriii',
        });
    }
}

export { HealthCheckController }