import { expect, jest } from "@jest/globals";
import request from "supertest";
import { buildTestServer } from "./utils/buildTestServer.js";
import { PedidoController } from "../../controllers/pedidoController.js";
import { PedidoService } from "../../services/pedidoService.js";
import { pedidosRouter } from "../../routers/pedidoRouter.js";

const mockPedidoRepo = {
    getAll: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findByUserId: jest.fn()
};

const mockProductoRepo = {
    findById: jest.fn(),
    updateProducto: jest.fn()
};

const pedidoService = new PedidoService(mockPedidoRepo, mockProductoRepo);
const pedidoController = new PedidoController(pedidoService);

const server = buildTestServer();
server.addRoute(pedidosRouter);
server.setController(PedidoController, pedidoController);
server.configureRoutes();

describe("GET /pedidos - Obtener pedidos", () => {
    test("Debería devolver todos los pedidos", async () => {
        const pedidos = [
            {
                _id: "507f1f77bcf86cd799439011",
                comprador: { _id: "507f1f77bcf86cd799439012", nombre: "Juan" },
                items: [],
                total: 5000,
                moneda: "PESO_ARG",
                estado: "PENDIENTE",
                direccionEntrega: {
                    calle: "Calle 1",
                    numero: "123",
                    ciudad: "Ciudad",
                    provincia: "Provincia",
                    codigoPostal: "1234"
                }
            },
            {
                _id: "507f1f77bcf86cd799439013",
                comprador: { _id: "507f1f77bcf86cd799439014", nombre: "María" },
                items: [],
                total: 10000,
                moneda: "PESO_ARG",
                estado: "CONFIRMADO",
                direccionEntrega: {
                    calle: "Calle 2",
                    numero: "456",
                    ciudad: "Ciudad",
                    provincia: "Provincia",
                    codigoPostal: "5678"
                }
            }
        ];

        mockPedidoRepo.getAll.mockResolvedValue(pedidos);

        const response = await request(server.app).get("/pedidos");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(mockPedidoRepo.getAll).toHaveBeenCalled();
    });
});

describe("GET /pedidos/:id - Obtener pedido por ID", () => {
    test("Debería devolver un pedido cuando existe", async () => {
        const pedido = {
            _id: "507f1f77bcf86cd799439011",
            comprador: { _id: "507f1f77bcf86cd799439012", nombre: "Juan" },
            items: [
                {
                    producto: { _id: "507f1f77bcf86cd799439013", titulo: "Remera" },
                    cantidad: 2,
                    precioUnitario: 5000,
                    moneda: "PESO_ARG"
                }
            ],
            total: 10000,
            moneda: "PESO_ARG",
            estado: "PENDIENTE",
            direccionEntrega: {
                calle: "Av. Test",
                numero: "123",
                ciudad: "Ciudad",
                provincia: "Provincia",
                codigoPostal: "1234"
            }
        };

        mockPedidoRepo.findById.mockResolvedValue(pedido);

        const response = await request(server.app).get("/pedidos/507f1f77bcf86cd799439011");

        expect(response.status).toBe(200);
        expect(response.body._id).toBe("507f1f77bcf86cd799439011");
        expect(response.body.estado).toBe("PENDIENTE");
        expect(mockPedidoRepo.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    });
});
