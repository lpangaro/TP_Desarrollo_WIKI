import { expect, jest } from "@jest/globals";
import request from "supertest";
import { buildTestServer } from "./utils/buildTestServer.js";
import { ProductoController } from "../../controllers/productoController.js";
import { ProductoService } from "../../services/productoService.js";
import { productoRouter } from "../../routers/productoRouter.js";

const mockProductoRepo = {
    getAll: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    findProductsByUser: jest.fn(),
    updateProducto: jest.fn()
};

const productoService = new ProductoService(mockProductoRepo);
const productoController = new ProductoController(productoService);

const server = buildTestServer();
server.addRoute(productoRouter);
server.setController(ProductoController, productoController);
server.configureRoutes();

describe("GET /productos - Obtener productos con filtros", () => {
    let producto1;
    let producto2;
    let producto3;

    beforeEach(() => {
        jest.clearAllMocks();

        // Crear productos como objetos planos (como vienen de la BD)
        producto1 = {
            _id: "507f1f77bcf86cd799439011",
            titulo: "Remera Deportiva",
            descripcion: "Remera para hacer deporte",
            precio: 5000,
            moneda: "PESO_ARG",
            stock: 10,
            categorias: ["Ropa", "Deportes"],
            fotos: ["foto1.jpg"],
            vendedor: { _id: "507f1f77bcf86cd799439012", nombre: "Juan" }
        };

        producto2 = {
            _id: "507f1f77bcf86cd799439013",
            titulo: "Zapatillas Running",
            descripcion: "Zapatillas para correr",
            precio: 25000,
            moneda: "PESO_ARG",
            stock: 5,
            categorias: ["Calzado", "Deportes"],
            fotos: ["foto2.jpg"],
            vendedor: { _id: "507f1f77bcf86cd799439012", nombre: "Juan" }
        };

        producto3 = {
            _id: "507f1f77bcf86cd799439014",
            titulo: "Pantalón Jean",
            descripcion: "Pantalón de jean azul",
            precio: 15000,
            moneda: "PESO_ARG",
            stock: 8,
            categorias: ["Ropa"],
            fotos: ["foto3.jpg"],
            vendedor: { _id: "507f1f77bcf86cd799439015", nombre: "María" }
        };
    });

    test("Debería devolver todos los productos cuando no hay filtros", async () => {
        mockProductoRepo.getAll.mockResolvedValue([producto1, producto2, producto3]);

        const response = await request(server.app)
            .get("/productos")
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
        expect(mockProductoRepo.getAll).toHaveBeenCalled();
    });

    test("Debería filtrar productos por precio mínimo y máximo", async () => {
        mockProductoRepo.getAll.mockResolvedValue([producto1, producto3]);

        const response = await request(server.app)
            .get("/productos")
            .query({ page: 1, limit: 10, minPrice: 5000, maxPrice: 20000 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(mockProductoRepo.getAll).toHaveBeenCalled();
    });

    test("Debería filtrar productos por título (búsqueda)", async () => {
        mockProductoRepo.getAll.mockResolvedValue([producto1]);

        const response = await request(server.app)
            .get("/productos")
            .query({ page: 1, limit: 10, titulo: "Remera" });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].titulo).toBe("Remera Deportiva");
        expect(mockProductoRepo.getAll).toHaveBeenCalled();
    });

    test("Debería ordenar productos por precio descendente", async () => {
        mockProductoRepo.getAll.mockResolvedValue([producto2, producto3, producto1]);

        const response = await request(server.app)
            .get("/productos")
            .query({ page: 1, limit: 10, ordenPrecio: "desc" });

        expect(response.status).toBe(200);
        expect(mockProductoRepo.getAll).toHaveBeenCalled();
    });

    test("Debería filtrar productos por moneda", async () => {
        const productoDolar = {
            _id: "507f1f77bcf86cd799439016",
            titulo: "Campera Importada",
            descripcion: "Campera de marca",
            precio: 100,
            moneda: "DOLAR",
            stock: 2,
            categorias: ["Ropa"],
            fotos: ["foto4.jpg"],
            vendedor: { _id: "507f1f77bcf86cd799439012", nombre: "Juan" }
        };

        mockProductoRepo.getAll.mockResolvedValue([productoDolar]);

        const response = await request(server.app)
            .get("/productos")
            .query({ page: 1, limit: 10, moneda: "DOLAR" });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].moneda).toBe("DOLAR");
        expect(mockProductoRepo.getAll).toHaveBeenCalled();
    });
});

describe("GET /productos/:id - Obtener producto por ID", () => {
    test("Debería devolver un producto cuando el ID existe", async () => {
        const producto = {
            _id: "507f1f77bcf86cd799439011",
            titulo: "Producto Test",
            descripcion: "Descripción test",
            precio: 1000,
            moneda: "PESO_ARG",
            stock: 5,
            categorias: ["Test"],
            fotos: [],
            vendedor: { _id: "507f1f77bcf86cd799439012", nombre: "Vendedor Test" }
        };

        mockProductoRepo.findById.mockResolvedValue(producto);

        const response = await request(server.app).get("/productos/507f1f77bcf86cd799439011");

        expect(response.status).toBe(200);
        expect(response.body.titulo).toBe("Producto Test");
        expect(mockProductoRepo.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    });

    test("Debería devolver 404 cuando el producto no existe", async () => {
        mockProductoRepo.findById.mockResolvedValue(null);

        const response = await request(server.app).get("/productos/507f1f77bcf86cd799439011");

        expect(response.status).toBe(404);
    });
});

describe("POST /productos - Crear nuevo producto", () => {
    test("Debería rechazar producto sin título", async () => {
        const productoInvalido = {
            descripcion: "Sin título",
            precio: 5000,
            moneda: "PESO_ARG",
            stock: 10,
            categorias: ["Test"]
        };

        const response = await request(server.app)
            .post("/productos")
            .send(productoInvalido);

        expect(response.status).toBe(400);
        expect(mockProductoRepo.save).not.toHaveBeenCalled();
    });

    test("Debería rechazar producto con precio negativo", async () => {
        const productoInvalido = {
            titulo: "Producto",
            descripcion: "Con precio negativo",
            precio: -100,
            moneda: "PESO_ARG",
            stock: 10,
            categorias: ["Test"],
            vendedor: "vendedorId"
        };

        const response = await request(server.app)
            .post("/productos")
            .send(productoInvalido);

        expect(response.status).toBe(400);
        expect(mockProductoRepo.save).not.toHaveBeenCalled();
    });
});

describe("GET /productos/vendedor/:vendedorId - Obtener productos de un vendedor", () => {
    test("Debería devolver todos los productos de un vendedor específico", async () => {
        const productosVendedor = [
            {
                _id: "507f1f77bcf86cd799439011",
                titulo: "Producto 1",
                descripcion: "Desc 1",
                precio: 1000,
                moneda: "PESO_ARG",
                stock: 5,
                categorias: ["Cat1"],
                fotos: [],
                vendedor: { _id: "507f1f77bcf86cd799439012", nombre: "Juan" }
            },
            {
                _id: "507f1f77bcf86cd799439013",
                titulo: "Producto 2",
                descripcion: "Desc 2",
                precio: 2000,
                moneda: "PESO_ARG",
                stock: 3,
                categorias: ["Cat2"],
                fotos: [],
                vendedor: { _id: "507f1f77bcf86cd799439012", nombre: "Juan" }
            }
        ];

        mockProductoRepo.findProductsByUser.mockResolvedValue(productosVendedor);

        const response = await request(server.app)
            .get("/productos/vendedor/507f1f77bcf86cd799439012")
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(mockProductoRepo.findProductsByUser).toHaveBeenCalled();
    });

    test("Debería devolver array vacío cuando el vendedor no tiene productos", async () => {
        mockProductoRepo.findProductsByUser.mockResolvedValue([]);

        const response = await request(server.app)
            .get("/productos/vendedor/507f1f77bcf86cd799439012")
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(0);
    });
});
