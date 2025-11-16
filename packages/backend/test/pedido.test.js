import { Usuario } from "../domain/usuarios/Usuario.js"
import { TipoUsuario } from "../domain/usuarios/enum_tiposUsuario.js"
import { DireccionDeEntrega } from "../domain/pedidos/DireccionDeEntrega.js"
import { Producto } from "../domain/productos/Producto.js"
import { ItemPedido } from "../domain/pedidos/ItemPedido.js"
import { Categoria } from "../domain/productos/Categoria.js"
import { Moneda } from "../domain/pedidos/enum_monedas.js"
import { Pedido } from "../domain/pedidos/Pedido.js";



//USUARIOS
let todoMuebles = new Usuario("0001", "Todo Muebles", "todo@muebles.com", "111234-5678", TipoUsuario.VENDEDOR, new Date());
let juanPerez = new Usuario("0002", "Juan Perez", "juanperez@gmail.com", "222234-5678", TipoUsuario.COMPRADOR, new Date());

//Direccion de Entrega 
let casaJuan = new DireccionDeEntrega("Calle Falsa", 123, "1", "A", "8400", "Bariloche", "Rio Negro", "Argentina", "-41.116995", "-71.406849");

//Categorias
let muebles = new Categoria("Muebles");

//Productos
let escritorio = new Producto("0001", todoMuebles, "Escritorio de madera", muebles, 70000, Moneda.PESO_ARG, 1, ["foto1.jpg", "foto2.jpg"], true);
let silla = new Producto("0002", todoMuebles, "Silla de oficina", muebles, 50000, Moneda.PESO_ARG, 10, ["foto3.jpg", "foto4.jpg"], true);
let cama = new Producto("0003", todoMuebles, "Cama", muebles, 150000, Moneda.PESO_ARG, 5, ["foto5.jpg", "foto6.jpg"], true);
//Items del Pedido   
let item1 = new ItemPedido(escritorio, 6, 70000); //no tiene stock suficiente
let item2 = new ItemPedido(silla, 1, 50000);
let item3 = new ItemPedido(cama, 2, 150000);

describe("Pedido Tests", () => {
	test("Creo un pedido y hay stock suficiente de cada producto", () => {
		let pedido = new Pedido("00001", juanPerez, [item2, item3], Moneda.PESO_ARG, casaJuan);
		expect(pedido.id).toBe("00001");
		expect(pedido.comprador.id).toBe(juanPerez.id);
		expect(pedido.estado).toBe('Pendiente');
		expect(pedido.validarStock()).toBe(true);
	});

	test("No se crea pedido cuando falta stock (constructor lanza)", () => {
		expect(() => new Pedido("00002", juanPerez, [item1], Moneda.PESO_ARG, casaJuan))
			.toThrow(/STOCK_INSUFICIENTE/);
	});

	test("Marcar un pedido como enviado", () => {
		let pedido = new Pedido("00003", juanPerez, [item2, item3], Moneda.PESO_ARG, casaJuan);
		expect(pedido.estado).toBe('Pendiente');
		pedido.actualizarEstado('Enviado', todoMuebles, "El pedido fue enviado por el vendedor");
		expect(pedido.estado).toBe('Enviado');
	});

	test("Calcular el total del pedido correctamente", () => {
		let pedido = new Pedido("00004", juanPerez, [item2, item3], Moneda.PESO_ARG, casaJuan);
		let totalEsperado = (1 * 50000) + (2 * 150000); // 350000
		expect(pedido.calcularTotal()).toBe(totalEsperado);
	});

	test("Marcar un pedido como entregado", () => {
		let pedido = new Pedido("00005", juanPerez, [item2], Moneda.PESO_ARG, casaJuan);
		pedido.actualizarEstado('Enviado', todoMuebles, "Enviado");
		pedido.actualizarEstado('Entregado', todoMuebles, "El pedido fue entregado");
		expect(pedido.estado).toBe('Entregado');
	});

	test("Cancelar un pedido pendiente", () => {
		let pedido = new Pedido("00006", juanPerez, [item2], Moneda.PESO_ARG, casaJuan);
		pedido.actualizarEstado('Cancelado', juanPerez, "Cancelado por el cliente");
		expect(pedido.estado).toBe('Cancelado');
	});

	test("Pedido con múltiples items del mismo producto", () => {
		let item4 = new ItemPedido(silla, 5, 50000); // 5 sillas, stock disponible: 10
		let pedido = new Pedido("00008", juanPerez, [item4], Moneda.PESO_ARG, casaJuan);
		expect(pedido.validarStock()).toBe(true);
		expect(pedido.items.length).toBe(1);
		expect(pedido.items[0].cantidad).toBe(5);
	});

	test("Pedido con stock justo en el límite", () => {
		let itemLimite = new ItemPedido(escritorio, 1, 70000); // 1 escritorio, stock disponible: 1
		let pedido = new Pedido("00009", juanPerez, [itemLimite], Moneda.PESO_ARG, casaJuan);
		expect(pedido.validarStock()).toBe(true);
	});

	test("Verificar moneda del pedido", () => {
		let pedido = new Pedido("00010", juanPerez, [item2], Moneda.PESO_ARG, casaJuan);
		expect(pedido.moneda).toBe(Moneda.PESO_ARG);
	});
});