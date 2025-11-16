import { NotificacionService } from '../services/notificacionService.js'
import { jest } from "@jest/globals"

describe("NotificacioneService.update", () => {
    const mockRepo = {
        findByIdAndUpdate: jest.fn(),
        update: jest.fn(),
    }

    const notificacionService = new NotificacionService(mockRepo);

    test("Notificacion marcada como leida", () => {
        const notificacionId = "12345";
        const updateData = { leida: true };
        const updatedNotificacion = {
            id: notificacionId,
            usuarioDestino: "user1",
            mensaje: "El pedido fue enviado",
            fechaAlta: new Date(),
            leida: true
        };

        mockRepo.update.mockResolvedValue(updatedNotificacion);

        return notificacionService.update(notificacionId, updateData)
            .then(result => {
                expect(mockRepo.update).toHaveBeenCalledWith(notificacionId, updateData);
                expect(result).toEqual(updatedNotificacion);
            });
    });
})