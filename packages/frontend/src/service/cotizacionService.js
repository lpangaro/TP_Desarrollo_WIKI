import { toISO, fromISO } from '../utils/Monedas';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * Obtiene todas las cotizaciones disponibles desde el backend
 */
export const obtenerCotizaciones = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/cotizaciones`);
        if (!response.ok) {
            throw new Error('Error al obtener cotizaciones');
        }
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo cotizaciones:', error);
        throw error;
    }
};

/**
 * Convierte un monto entre monedas
 * Acepta tanto códigos internos (PESO_ARG, DOLAR, REAL) como ISO (ARS, USD, BRL)
 */
export const convertirMoneda = async (monto, monedaOrigen, monedaDestino) => {
    try {
        // Convertir a códigos ISO si vienen en formato interno
        const monedaOrigenISO = toISO(monedaOrigen);
        const monedaDestinoISO = toISO(monedaDestino);

        const params = new URLSearchParams({
            monto: monto.toString(),
            monedaOrigen: monedaOrigenISO,
            monedaDestino: monedaDestinoISO
        });

        const response = await fetch(`${API_BASE_URL}/cotizaciones/convertir?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error('Error al convertir moneda');
        }

        const data = await response.json();
        return data.montoConvertido;
    } catch (error) {
        console.error('Error convirtiendo moneda:', error);
        return monto; // Fallback: devolver el monto original
    }
};

/**
 * Convierte múltiples productos a una moneda destino
 */
export const convertirCarrito = async (productos, monedaDestino = 'ARS') => {
    try {
        const productosConvertidos = await Promise.all(
            productos.map(async (producto) => {
                const precioConvertido = await convertirMoneda(
                    producto.precio,
                    producto.moneda, // Puede venir como PESO_ARG, DOLAR, REAL
                    monedaDestino    // Viene como ARS, USD, BRL
                );

                return {
                    ...producto,
                    precioOriginal: producto.precio,
                    monedaOriginal: producto.moneda,
                    precioConvertido,
                    monedaConvertida: monedaDestino
                };
            })
        );

        return productosConvertidos;
    } catch (error) {
        console.error('Error convirtiendo carrito:', error);
        return productos;
    }
};