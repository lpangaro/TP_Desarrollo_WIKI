import { expect, jest } from "@jest/globals";
import request from "supertest";
import { buildTestServer } from "./utils/buildTestServer.js";
import { NotificacionController } from "../../controllers/notificacionController.js";
import { UsuarioController } from "../../controllers/usuarioController.js";
import { NotificacionService } from '../../services/notificacionService.js'
import { UsuarioService } from '../../services/usuarioService.js'
import { notifRouter } from "../../routers/notifRouter.js";
import { userRouter } from "../../routers/userRouter.js";
import { Notificacion } from "../../domain/notificacciones/Notificacion.js";
import { Usuario } from "../../domain/usuarios/Usuario.js";

const mockRepo = {
    getAll: jest.fn(),
    update: jest.fn(),
    findByFilters: jest.fn()
};

const mockUsuarioRepo = {
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn()
};

const notificacionService = new NotificacionService(mockRepo);
const usuarioService = new UsuarioService(mockUsuarioRepo, notificacionService);
const notificacionController = new NotificacionController(notificacionService);
const usuarioController = new UsuarioController(usuarioService);

const server = buildTestServer();
server.addRoute(notifRouter);
server.addRoute(userRouter);
server.setController(NotificacionController, notificacionController);
server.setController(UsuarioController, usuarioController);
server.configureRoutes();

describe("GET /notificaciones/ ", () => {
    let lucas;
    let notificacion1;
    let notificacion2;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRepo.getAll.mockReset();
        mockRepo.update.mockReset();
        mockRepo.findByFilters.mockReset();

        mockUsuarioRepo.findById.mockReset();
        mockUsuarioRepo.findAll.mockReset();
        mockUsuarioRepo.save.mockReset();

        lucas = new Usuario("507f1f77bcf86cd799439011", "Lucas", "Lucas@gmail.com", "123456789", "cliente");
        notificacion1 = new Notificacion("12345", lucas, "El pedido fue enviado", new Date());
        notificacion2 = new Notificacion("12346", lucas, "El pedido fue entregado", new Date());

    });

    test("Trae todas las notificaciones", () => {
        mockRepo.getAll.mockResolvedValue([notificacion1, notificacion2]);

        return request(server.app).get("/notificaciones")
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveLength(2);
                expect(res.body[0]).toMatchObject({
                    id: "12345",
                    mensaje: "El pedido fue enviado",
                    leida: false
                });
                expect(res.body[1]).toMatchObject({
                    id: "12346",
                    mensaje: "El pedido fue entregado",
                    leida: false
                });
                expect(mockRepo.getAll).toHaveBeenCalled();
            })
            .catch(error => {
                throw error;
            });
    });

    test("Trae Solo las notificaciones LEIDAS", () => {
        notificacion1.marcarComoLeida();
        const soloLeidas = [notificacion1];

        mockRepo.findByFilters.mockResolvedValue(soloLeidas);

        return request(server.app).get("/usuarios/507f1f77bcf86cd799439011/notificaciones?leida=true")
            .then(res => {
                expect(mockRepo.findByFilters).toHaveBeenCalledWith(expect.objectContaining({
                    usuarioDestino: "507f1f77bcf86cd799439011",
                    leida: true
                }));

                expect(res.status).toBe(200);
                expect(res.body).toHaveLength(1);
                expect(res.body[0].leida).toBe(true);
            })
            .catch(error => {
                throw error;
            });
    });
});