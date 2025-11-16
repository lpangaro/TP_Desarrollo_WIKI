import { PedidoService } from '../services/pedidoService.js'
import { jest } from "@jest/globals"

describe("PedidoService", () => {
    const mockRepo = {
        update: jest.fn(),
        findById: jest.fn(),
        findHistoryByUser: jest.fn(),
        getAll: jest.fn()
    }

    const pedidoService = new PedidoService(mockRepo);

    test("Actualizar Estado como Entregado", () => {
        const pedidoId = "12345";
        const nuevoEstado = "ENTREGADO";
        const motivo = "Entrega completada";

        const pedidoExistente = {
            id: pedidoId,
            estado: "ENVIADO",
            actualizarEstado: jest.fn()
        };

        const pedidoActualizado = {
            ...pedidoExistente,
            estado: "ENTREGADO"
        };

        mockRepo.findById.mockResolvedValue(pedidoExistente);
        mockRepo.update.mockResolvedValue(pedidoActualizado);

        // Mock de las dependencias 
        pedidoService.pedidoHandler = {
            validarCambioEstado: jest.fn()
        };
        pedidoService.notificacionService = {
            create: jest.fn().mockResolvedValue({})
        };

        return pedidoService.update(pedidoId, nuevoEstado, motivo)
            .then(result => {
                expect(mockRepo.findById).toHaveBeenCalledWith(pedidoId);
                expect(pedidoService.pedidoHandler.validarCambioEstado).toHaveBeenCalledWith(pedidoExistente, nuevoEstado);
                expect(result).toEqual(pedidoActualizado);
            });
    });

    test("Buscar pedido por ID", () => {
        const pedidoId = "12345";
        const pedidoEsperado = {
            id: pedidoId,
            comprador: "user1",
            estado: "PENDIENTE",
            total: 200
        };

        mockRepo.findById.mockResolvedValue(pedidoEsperado);

        return pedidoService.findById(pedidoId)
            .then(result => {
                expect(mockRepo.findById).toHaveBeenCalledWith(pedidoId);
                expect(result).toEqual(pedidoEsperado);
            });
    });

    test("Obtiene el historial de pedidos de un usuario", () => {
        const userId = "user123";
        const pedidos = [
            { id: "pedido1", comprador: userId, total: 200, estado: "ENTREGADO" },
            { id: "pedido2", comprador: userId, total: 150, estado: "CANCELADO" }
        ];

        mockRepo.findHistoryByUser.mockResolvedValue(pedidos);

        return pedidoService.findHistoryByUser(userId)
            .then(result => {
                expect(mockRepo.findHistoryByUser).toHaveBeenCalledWith(userId);
                expect(result).toEqual(pedidos);
            });
    });

});