
import React, { useState, useEffect } from 'react';
import { Card, Button, ButtonGroup, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { getMonedaSymbol } from '../../utils/Monedas';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { convertirCarrito } from '../../service/cotizacionService';
import Loading from '../../components/spinner/spinner';
import './Carrito.css';

const Carrito = ({ carrito, limpiarCarrito, actualizarCarrito }) => {
    const navigate = useNavigate();
    const [monedaSeleccionada, setMonedaSeleccionada] = useState('ARS');
    const [carritoConvertido, setCarritoConvertido] = useState([]);
    const [cargandoCotizaciones, setCargandoCotizaciones] = useState(false);

    // Convertir carrito cuando cambia la moneda o el contenido del carrito
    useEffect(() => {
        const convertirPrecios = async () => {
            if (carrito && carrito.length > 0) {
                setCargandoCotizaciones(true);
                try {
                    const productosConvertidos = await convertirCarrito(carrito, monedaSeleccionada);
                    setCarritoConvertido(productosConvertidos);
                } catch (error) {
                    console.error('Error convirtiendo precios:', error);
                    setCarritoConvertido(carrito);
                } finally {
                    setCargandoCotizaciones(false);
                }
            } else {
                setCarritoConvertido([]);
            }
        };

        convertirPrecios();
    }, [carrito, monedaSeleccionada]);

    const irACheckout = () => {
        // Pasar la moneda seleccionada al checkout
        navigate('/checkout', { state: { monedaSeleccionada } });
    };

    const irAlHome = () => {
        navigate('/');
    };

    const incrementarProducto = (index) => {
        const nuevoCarrito = [...carrito];
        nuevoCarrito[index] = { ...nuevoCarrito[index], cant: nuevoCarrito[index].cant + 1 };
        actualizarCarrito(nuevoCarrito);
    };

    const decrementarProducto = (index) => {
        const nuevoCarrito = [...carrito];
        if (nuevoCarrito[index].cant > 1) {
            nuevoCarrito[index] = { ...nuevoCarrito[index], cant: nuevoCarrito[index].cant - 1 };
            actualizarCarrito(nuevoCarrito);
        } else {
            eliminarProducto(index);
        }
    };

    const eliminarProducto = (index) => {
        const nuevoCarrito = [...carrito];
        nuevoCarrito.splice(index, 1);
        actualizarCarrito(nuevoCarrito);
    };

    const carritoVacio = !carrito || carrito.length === 0;

    // Calcular el total convertido
    const calcularTotal = () => {
        return carritoConvertido.reduce((total, producto) => {
            const cant = producto.cant || 1;
            const precio = producto.precioConvertido || producto.precio || 0;
            return total + (precio * cant);
        }, 0);
    };

    return (
        <div className="carrito-root">
            <Card className="carrito-card">
                <div className="carrito-header">
                    <h3>🛒 Mi carrito</h3>
                    
                    {!carritoVacio && (
                        <FormControl className="selector-moneda-carrito" size="small">
                            <InputLabel id="moneda-label">Ver precios en:</InputLabel>
                            <Select
                                labelId="moneda-label"
                                value={monedaSeleccionada}
                                label="Ver precios en:"
                                onChange={(e) => setMonedaSeleccionada(e.target.value)}
                            >
                                <MenuItem value="ARS">🇦🇷 ARS (Pesos Argentinos)</MenuItem>
                                <MenuItem value="USD">🇺🇸 USD (Dólares)</MenuItem>
                                <MenuItem value="BRL">🇧🇷 BRL (Reales)</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </div>

                <div className="carrito-resumen">
                    {carritoVacio ? (
                        <div className="carrito-vacio">
                            Aún no agregaste productos
                        </div>
                    ) : cargandoCotizaciones ? (
                        <Loading message="Actualizando precios..." size="small" />
                    ) : (
                        <>
                            <div>
                                {carritoConvertido.map((producto, index) => {
                                    const precioOriginal = producto.precio || 0;
                                    const precioConvertido = producto.precioConvertido || precioOriginal;
                                    const cantidad = producto.cant || 1;
                                    const subtotal = precioConvertido * cantidad;
                                    const esDiferenteMoneda = producto.moneda !== monedaSeleccionada;

                                    return (
                                        <div key={index}>
                                            <div className={`items ${producto.cant > producto.stock ? 'insuficiente' : ''}`}>
                                                <div className="productos">
                                                    {/* Miniatura del producto */}
                                                    {producto.fotos && producto.fotos[0] && (
                                                        <img 
                                                            src={producto.fotos[0]} 
                                                            alt={producto.titulo}
                                                            className="producto-miniatura"
                                                            style={{
                                                                width: '60px',
                                                                height: '60px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px',
                                                                marginRight: '12px'
                                                            }}
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="producto-titulo">
                                                            {producto.titulo}{producto.cant > 1 ? 's' : ''}
                                                            {esDiferenteMoneda && (
                                                                <span className="moneda-original">
                                                                    ({getMonedaSymbol(producto.moneda)} {precioOriginal} c/u)
                                                                </span>
                                                            )}
                                                        </div>
                                                        {producto.cant > producto.stock && (
                                                            <small className="text-danger d-block">
                                                                ⚠️ No hay suficiente stock (disponible: {producto.stock})
                                                            </small>
                                                        )}
                                                    </div>
                                                    <div className='precio'>
                                                        <div className="precio-convertido">
                                                            {getMonedaSymbol(monedaSeleccionada)} {subtotal.toFixed(2)}
                                                        </div>
                                                        <Button
                                                            className="eliminar"
                                                            onClick={() => eliminarProducto(index)}
                                                            aria-label={`Eliminar ${producto.titulo} del carrito`}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <ButtonGroup variant="outlined" aria-label={`Controles de cantidad para ${producto.titulo}`}>
                                                    <Button
                                                        className="decrementar"
                                                        onClick={() => decrementarProducto(index)}
                                                        aria-label="Disminuir cantidad"
                                                    >
                                                        -
                                                    </Button>
                                                    <Button disabled aria-label={`Cantidad: ${producto.cant}`}>
                                                        {producto.cant}
                                                    </Button>
                                                    <Button
                                                        className="incrementar"
                                                        onClick={() => incrementarProducto(index)}
                                                        aria-label="Aumentar cantidad"
                                                    >
                                                        +
                                                    </Button>
                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="total">
                                <div className="total-label">Total:</div>
                                <div className="total-monto">
                                    {getMonedaSymbol(monedaSeleccionada)} {calcularTotal().toFixed(2)}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="actions">
                    <Button onClick={irAlHome} aria-label="Volver a la página principal">
                        <FaArrowLeft /> ATRAS
                    </Button>
                    <Button
                        onClick={irACheckout}
                        disabled={carritoVacio || carrito.some(producto => producto.cant > producto.stock) || cargandoCotizaciones}
                        variant="contained"
                        aria-label="Proceder al pago"
                    >
                        INICIAR COMPRA
                    </Button>
                </div>
            </Card>
        </div>
    );
};

Carrito.propTypes = {
    carrito: PropTypes.array.isRequired,
    limpiarCarrito: PropTypes.func.isRequired,
    actualizarCarrito: PropTypes.func.isRequired
};

export default Carrito;