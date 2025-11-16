import React, { useState, useEffect } from 'react';
import { Card, TextField, Button, ButtonGroup, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { getMonedaSymbol } from '../../utils/Monedas';
import { FaCreditCard, FaHome, FaTrash, FaTruck, FaUser } from 'react-icons/fa';
import './Checkout.css';
import { crearPedido } from '../../service/productoService';
import { convertirCarrito } from '../../service/cotizacionService';
import { useAppContext } from '../../context/AppContext'
import Loading from "../../components/spinner/spinner.jsx";

const Checkout = ({ carrito, limpiarCarrito, actualizarCarrito, recargarProductos }) => {
    const inicializarCampo = (requerido = true) => ({ valor: '', requerido });
    const location = useLocation();
    const navigate = useNavigate();
    const [monedaSeleccionada, setMonedaSeleccionada] = useState(location.state?.monedaSeleccionada || 'ARS');
    const [carritoConvertido, setCarritoConvertido] = useState([]);
    const [cantidad, setCantidad] = useState(1);
    const [cargandoCotizaciones, setCargandoCotizaciones] = useState(false);
    const [intentoCompra, setIntentoCompra] = useState(false);

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
        if (cargandoCotizaciones) {
            return <Loading message="Actualizando precios..." size="large" />;
        }
        convertirPrecios();
    }, [carrito, monedaSeleccionada]);
    const { user } = useAppContext()

    const [campos, setCampos] = useState({
        // Datos personales
        nombre: inicializarCampo(),
        apellido: inicializarCampo(),
        telefono: inicializarCampo(),
        email: inicializarCampo(),

        // Datos del destinatario
        calle: inicializarCampo(),
        numero: inicializarCampo(),
        piso: inicializarCampo(false),
        departamento: inicializarCampo(false), // No requerido
        ciudad: inicializarCampo(),
        provincia: inicializarCampo(),
        codigoPostal: inicializarCampo(),
        pais: inicializarCampo(),

        // Información de pago
        nombreTitular: inicializarCampo(),
        dni: inicializarCampo(),
        numeroTarjeta: inicializarCampo(),
        vencimiento: inicializarCampo(),
        codigoSeguridad: inicializarCampo()
    });

    const setValorDe = (campo) => (event) => {
        setCampos({
            ...campos,
            [campo]: { ...campos[campo], valor: event.target.value }
        });
    };

    // Función para verificar si un campo tiene error
    const campoTieneError = (campo) => {
        return intentoCompra && campos[campo].requerido && campos[campo].valor.trim() === '';
    };

    const camposCompletos = Object.entries(campos)
        .filter(([_, campo]) => campo.requerido)
        .every(([_, campo]) => campo.valor.trim() !== '');

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



    const handleComprar = async () => {
        // Marcar que se intentó comprar para activar validación visual
        setIntentoCompra(true);

        // Verificar si todos los campos requeridos están completos
        if (!camposCompletos) {
            toast.warning('⚠️ Por favor, complete todos los campos requeridos');
            return;
        }

        try {
            // Crear un solo pedido con todos los productos del carrito
            await crearPedido(
                user._id,
                carrito,
                campos.calle.valor,
                campos.numero.valor,
                campos.departamento.valor || 'S/N', // Valor por defecto si está vacío
                campos.ciudad.valor,
                campos.provincia.valor,
                campos.pais.valor,
                campos.codigoPostal.valor
            );

            toast.success('💳 Compra realizada con éxito!');
            limpiarCarrito();

            await recargarProductos(); // Recargar productos para actualizar el stock

            navigate('/');
        } catch (error) {
            console.error('Error al crear el Pedido:', error);
            toast.error('Hubo un error al guardar el Pedido. Intenta nuevamente.');
        }
    };

    const irAlHome = () => {
        navigate('/');
    };

    const calcularTotal = () => {
        return carritoConvertido.reduce((total, producto) => {
            const cant = producto.cant || 1;
            const precio = producto.precioConvertido || producto.precio || 0;
            return total + (precio * cant);
        }, 0);
    };

    return (
        <div className="checkout-root">
            <div className="checkout-container">
                <Card className="checkout-card checkout-form">
                    <form>
                        {/* Datos Personales */}
                        <div className="form-section">
                            <h3> <FaUser /> Datos Personales</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <TextField
                                    label="Nombre"
                                    required
                                    fullWidth
                                    margin="normal"
                                    value={campos.nombre.valor}
                                    onChange={setValorDe('nombre')}
                                    error={campoTieneError('nombre')}
                                    helperText={campoTieneError('nombre') ? 'Por favor ingrese su nombre' : ''}
                                />
                                <TextField
                                    label="Apellido"
                                    required
                                    fullWidth
                                    margin="normal"
                                    value={campos.apellido.valor}
                                    onChange={setValorDe('apellido')}
                                    error={campoTieneError('apellido')}
                                    helperText={campoTieneError('apellido') ? 'Por favor ingrese su apellido' : ''}
                                />
                            </div>
                            <TextField
                                label="Teléfono"
                                required
                                fullWidth
                                margin="normal"
                                type="tel"
                                placeholder="+54 9 11 1234-5678"
                                value={campos.telefono.valor}
                                onChange={setValorDe('telefono')}
                                error={campoTieneError('telefono')}
                                helperText={campoTieneError('telefono') ? 'Por favor ingrese un número de teléfono' : ''}
                            />
                            <TextField
                                label="Email"
                                required
                                fullWidth
                                margin="normal"
                                type="email"
                                value={campos.email.valor}
                                onChange={setValorDe('email')}
                                error={campoTieneError('email')}
                                helperText={campoTieneError('email') ? 'Por favor ingrese su email' : ''}
                            />
                        </div>

                        {/* Datos del Destinatario */}
                        <div className="form-section">
                            <h3> <FaTruck /> Direccion de Envio</h3>
                            <TextField
                                label="Calle"
                                placeholder="Av. Siempre Viva"
                                required
                                fullWidth
                                margin="normal"
                                value={campos.calle.valor}
                                onChange={setValorDe('calle')}
                                error={campoTieneError('calle')}
                                helperText={campoTieneError('calle') ? 'Por favor ingrese la calle' : ''}
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <TextField
                                    label="Número"
                                    placeholder="742"
                                    required
                                    margin="normal"
                                    style={{ flex: 1 }}
                                    value={campos.numero.valor}
                                    onChange={setValorDe('numero')}
                                    error={campoTieneError('numero')}
                                    helperText={campoTieneError('numero') ? 'Por favor ingrese el número' : ''}
                                />
                                <TextField
                                    label="Piso"
                                    placeholder="3"
                                    margin="normal"
                                    style={{ flex: 1 }}
                                    value={campos.piso.valor}
                                    onChange={setValorDe('piso')}
                                />
                                <TextField
                                    label="Departamento"
                                    placeholder="A"
                                    margin="normal"
                                    style={{ flex: 1 }}
                                    value={campos.departamento.valor}
                                    onChange={setValorDe('departamento')}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <TextField
                                    label="Pais"
                                    placeholder="Argentina"
                                    required
                                    fullWidth
                                    margin="normal"
                                    value={campos.pais.valor}
                                    onChange={setValorDe('pais')}
                                    error={campoTieneError('pais')}
                                    helperText={campoTieneError('pais') ? 'Por favor ingrese el país' : ''}
                                />
                                <TextField
                                    label="Provincia"
                                    placeholder="CABA"
                                    required
                                    fullWidth
                                    margin="normal"
                                    value={campos.provincia.valor}
                                    onChange={setValorDe('provincia')}
                                    error={campoTieneError('provincia')}
                                    helperText={campoTieneError('provincia') ? 'Por favor ingrese la provincia' : ''}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <TextField
                                    label="Ciudad"
                                    placeholder="Springfield"
                                    required
                                    fullWidth
                                    margin="normal"
                                    value={campos.ciudad.valor}
                                    onChange={setValorDe('ciudad')}
                                    error={campoTieneError('ciudad')}
                                    helperText={campoTieneError('ciudad') ? 'Por favor ingrese la ciudad' : ''}
                                />
                                <TextField
                                    label="Codigo Postal"
                                    placeholder="1406"
                                    required
                                    fullWidth
                                    margin="normal"
                                    value={campos.codigoPostal.valor}
                                    onChange={setValorDe('codigoPostal')}
                                    error={campoTieneError('codigoPostal')}
                                    helperText={campoTieneError('codigoPostal') ? 'Por favor ingrese código postal' : ''}
                                />
                            </div>
                        </div>

                        {/* Información de Pago */}
                        <div className="form-section">
                            <h3><FaCreditCard /> Información de Pago</h3>
                            <TextField
                                label="Nombre del Titular"
                                required
                                fullWidth
                                margin="normal"
                                placeholder="Como aparece en la tarjeta"
                                value={campos.nombreTitular.valor}
                                onChange={setValorDe('nombreTitular')}
                                error={campoTieneError('nombreTitular')}
                                helperText={campoTieneError('nombreTitular') ? 'Por favor ingrese el nombre del titular' : ''}
                            />
                            <TextField
                                label="DNI"
                                required
                                fullWidth
                                margin="normal"
                                placeholder="12345678"
                                value={campos.dni.valor}
                                onChange={setValorDe('dni')}
                                error={campoTieneError('dni')}
                                helperText={campoTieneError('dni') ? 'Por favor ingrese el DNI' : ''}
                            />
                            <TextField
                                label="Número de Tarjeta"
                                required
                                fullWidth
                                margin="normal"
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                inputProps={{ maxLength: 16 }}
                                value={campos.numeroTarjeta.valor}
                                onChange={setValorDe('numeroTarjeta')}
                                error={campoTieneError('numeroTarjeta')}
                                helperText={campoTieneError('numeroTarjeta') ? 'Por favor ingrese el número de tarjeta' : ''}
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <TextField
                                    label="Vencimiento"
                                    required
                                    margin="normal"
                                    placeholder="MM/AA"
                                    style={{ flex: 1 }}
                                    inputProps={{ maxLength: 5 }}
                                    value={campos.vencimiento.valor}
                                    onChange={setValorDe('vencimiento')}
                                    error={campoTieneError('vencimiento')}
                                    helperText={campoTieneError('vencimiento') ? 'Por favor ingrese el vencimiento' : ''}
                                />
                                <TextField
                                    label="Código de Seguridad"
                                    required
                                    margin="normal"
                                    type="password"
                                    placeholder="CVV"
                                    style={{ flex: 1 }}
                                    inputProps={{ maxLength: 4 }}
                                    value={campos.codigoSeguridad.valor}
                                    onChange={setValorDe('codigoSeguridad')}
                                    error={campoTieneError('codigoSeguridad')}
                                    helperText={campoTieneError('codigoSeguridad') ? 'Por favor ingrese el código de seguridad' : ''}
                                />
                            </div>
                        </div>

                        <div className="actions">
                            <Button onClick={irAlHome} aria-label="Cancelar compra y volver al inicio">CANCELAR</Button>
                            <Button
                                variant="contained"
                                onClick={handleComprar}
                                aria-label="Confirmar y realizar compra"
                            >
                                COMPRAR
                            </Button>
                        </div>
                    </form>
                </Card>

                <Card className="checkout-card checkout-cart">
                    <h3>Resumen del Carrito</h3>
                    <div className="carrito-resumen">
                        {cargandoCotizaciones ? (
                            <div className="cargando-cotizaciones">
                                <CircularProgress size={24} />
                                <span>Actualizando precios...</span>
                            </div>
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
                                                <div className="items">
                                                    <div className="productos">
                                                        <div className="producto-titulo">
                                                            {producto.titulo}{producto.cant > 1 ? 's' : ''}
                                                            {esDiferenteMoneda && (
                                                                <span className="moneda-original">
                                                                    ({getMonedaSymbol(producto.moneda)} {precioOriginal} c/u)
                                                                </span>
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
                                                        <Button disabled aria-label={`Cantidad: ${producto.cant}`}>{producto.cant}</Button>
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
                </Card>
            </div>
        </div>
    );
};

Checkout.propTypes = {
    carrito: PropTypes.array.isRequired,
    limpiarCarrito: PropTypes.func.isRequired,
    actualizarCarrito: PropTypes.func.isRequired,
    recargarProductos: PropTypes.func.isRequired
};

export default Checkout;