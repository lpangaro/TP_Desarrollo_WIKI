import { ProductoService } from '../services/productoService.js'
import { jest } from "@jest/globals"

describe("ProductoService", () => {
    const mockRepo = {
        save: jest.fn(),
        getAll: jest.fn(),
        findById: jest.fn(),
        findProductsByUser: jest.fn(),
        update: jest.fn()
    }

    const mockUsuarioService = {
        find: jest.fn()
    }

    const productoService = new ProductoService(mockRepo, mockUsuarioService);

    test("Crear producto con vendedor válido", () => {
        const productoData = {
            titulo: "Laptop Gaming",
            descripcion: "Laptop para gaming de alta gama",
            precio: 1500,
            vendedor: "65f1a2b3c4d5e6f7a8b9c0d1",
            categorias: ["Tecnología", "Gaming"]
        };

        const vendedorMock = {
            id: "65f1a2b3c4d5e6f7a8b9c0d1",
            nombre: "Juan Pérez",
            tipo: "VENDEDOR"
        };

        const productoCreado = {
            id: "65f1a2b3c4d5e6f7a8b9c0d2",
            ...productoData
        };

        mockUsuarioService.find.mockResolvedValue(vendedorMock);
        mockRepo.save.mockResolvedValue(productoCreado);

        return productoService.create(productoData)
            .then(result => {
                expect(mockUsuarioService.find).toHaveBeenCalledWith(productoData.vendedor);
                expect(mockRepo.save).toHaveBeenCalledWith(productoData);
                expect(result).toEqual(productoCreado);
            });
    });

    test("Buscar producto por ID existente", () => {
        const productoId = "65f1a2b3c4d5e6f7a8b9c0d1";
        const productoMock = {
            id: productoId,
            titulo: "Smartphone",
            precio: 800,
            vendedor: "65f1a2b3c4d5e6f7a8b9c0d2"
        };

        mockRepo.findById.mockResolvedValue(productoMock);

        return productoService.findById(productoId)
            .then(result => {
                expect(mockRepo.findById).toHaveBeenCalledWith(productoId);
                expect(result).toEqual(productoMock);
            });
    });

    test("Buscar productos por usuario con filtros", () => {
        const userId = "65f1a2b3c4d5e6f7a8b9c0d1";
        const filtros = {
            titulo: "laptop",
            categoria: "Tecnología",
            minPrice: 500,
            maxPrice: 2000,
            page: 1,
            limit: 5
        };

        const productosMock = [
            { id: "prod1", titulo: "Laptop Dell", precio: 1200, vendedor: userId },
            { id: "prod2", titulo: "Laptop HP", precio: 900, vendedor: userId }
        ];

        mockRepo.findProductsByUser.mockResolvedValue(productosMock);

        return productoService.findProductsByUser(userId, filtros)
            .then(result => {
                expect(mockRepo.findProductsByUser).toHaveBeenCalledWith(
                    expect.objectContaining({
                        vendedor: expect.any(Object), // mongo
                        titulo: { $regex: "laptop", $options: "i" },
                        categorias: { $in: ["Tecnología"] },
                        precio: { $gte: 500, $lte: 2000 }
                    }),
                    expect.any(Object), // sort
                    1, // page
                    5  // limit
                );
                expect(result).toEqual(productosMock);
            });
    });

    test("Actualizar producto existente", () => {
        const productoData = {
            id: "65f1a2b3c4d5e6f7a8b9c0d1", // ObjectId válido
            titulo: "Laptop Gaming Actualizada",
            precio: 1600,
            descripcion: "Nueva descripción"
        };

        const productoActualizado = {
            ...productoData,
            fechaActualizacion: new Date()
        };

        mockRepo.update.mockResolvedValue(productoActualizado);

        return productoService.update(productoData)
            .then(result => {
                expect(mockRepo.update).toHaveBeenCalledWith(productoData);
                expect(result).toEqual(productoActualizado);
            });
    });
});