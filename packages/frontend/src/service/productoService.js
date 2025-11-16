import axios from "axios";
import { PiArrowsInSimple } from "react-icons/pi";
import { FaLongArrowAltDown } from "react-icons/fa";
import { ISOToMoneda } from "../utils/Monedas";


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'

const URL_BACKEND = process.env.REACT_APP_URL_BACKEND;

export const getProductos = async (page = 1, limit = 8, filters = {}) => {
    try {
        let url = `${API_BASE_URL}/productos?page=${page}&limit=${limit}`;

        // Agregar filtros opcionales
        if (filters.maxPrice !== undefined) {
            url += `&maxPrice=${filters.maxPrice}`;
        }
        if (filters.minPrice !== undefined) {
            url += `&minPrice=${filters.minPrice}`;
        }
        if (filters.titulo && filters.titulo.trim() !== "") {
            url += `&titulo=${encodeURIComponent(filters.titulo)}`;
        }
        if (filters.ordenPrecio !== undefined) {
            url += `&precio=${filters.ordenPrecio}`;  //asc o desc
        }
        if (filters.moneda !== undefined && filters.moneda !== "") {
            // Convertir de formato ISO (ARS, USD, BRL) a formato BD (PESO_ARG, DOLAR, REAL)
            const monedaBD = ISOToMoneda[filters.moneda] || filters.moneda;
            url += `&moneda=${monedaBD}`;
        }

        const prods = await axios.get(url);
        return prods.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getProductsByUser = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/productos/vendedor/${id}`)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getProductoById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/productos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching producto by id:", error);
        throw error;
    }
}

export const crearPedido = async (iduser, carrito, calle, numero, departamento, ciudad, provincia, pais, CP) => {
    try {
        const idUsuario = iduser
        const direccionEntrega = {
            calle: calle,
            altura: numero,
            departamento: departamento || "",
            codigoPostal: CP,
            ciudad: ciudad,
            provincia: provincia,
            pais: pais,
            lat: "-34.6037",    //HARDCODEADO
            lon: "-58.3816"     //HARDCODEADO
        };

        // Crear un array de items desde el carrito usando _id
        const items = carrito.map(producto => ({
            producto: producto._id,  // CLAVE: usar _id en lugar de id
            cantidad: producto.cant
        }));

        // Usar la moneda del primer producto
        const moneda = carrito[0]?.moneda || "PESO_ARG";

        const response = await axios.post(`${API_BASE_URL}/pedidos`, {
            comprador: idUsuario,
            items: items,
            moneda: moneda,
            direccionEntrega: direccionEntrega
        });
        return response.data;
    } catch (error) {
        console.error(`Error al crear el pedido:`, error);
        throw error;
    }
}

