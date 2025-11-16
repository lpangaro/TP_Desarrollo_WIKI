import { useParams } from "react-router-dom";
// import { productos } from "../../components/mockData/Productos";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ButtonGroup, Button } from '@mui/material';
import { getMonedaSymbol } from "../../utils/Monedas";
import "./ProductoDetailPage.css"
import FuzzyText from "../../components/FuzzyText/index.jsx";
import SplitText from "../../components/SplitText/index.jsx";
import { getProductoById } from '../../service/productoService.js';
import PropTypes from 'prop-types';
import CarruselImageProduct from "../../components/carruselImageProducts/CarruselImageProducts.jsx";
import Loading from "../../components/spinner/spinner.jsx";

const conProductos = (cant, producto) => ({ ...producto, cant })


const ProductoDetailPage = ({ productos, carrito, actualizarCarrito }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                setLoading(true);
                const productoEncontrado = await getProductoById(id);
                setProducto(productoEncontrado);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando producto:", error);
                setProducto(null);
                setLoading(false);
            }
        };

        cargarProducto();
    }, [id]);


    const incrementarProducto = () => {
        setCantidad(cantidad + 1);
    };

    const decrementarProducto = () => {
        if (cantidad > 0) {
            setCantidad(cantidad - 1);
        }
    };

    const addCarrito = () => {
        actualizarCarrito(conProductos(cantidad, producto));
        navigate("/");
    };

     if (loading) {
        return <Loading message="Cargando producto..." size="large" />;
    }

    if (!producto) { //404 producto no encontrado
        return (
            <div className="producto-detail-container">
                <div className="error-message">
                    <FuzzyText color="#111" baseIntensity={0.2} hoverIntensity={0.6} enableHover={true} fontSize='120px'>404</FuzzyText>
                    <FuzzyText color="#111" baseIntensity={0.2} hoverIntensity={0.6} enableHover={true} fontSize='50px'>not found</FuzzyText>

                    <h1>Producto no encontrado</h1>
                    <p>Lo sentimos, no pudimos encontrar el producto que buscas.</p>
                </div>
            </div>
        );
    }

    return ( // Detalle del producto
        <div className="producto-detail-container">
            <div className="producto-header">
                <h1 className="producto-titulo">{producto.titulo}</h1>
                <div className="producto-categoria">#{producto.categorias.join(" #")}</div>
            </div>

            <div className="producto-content">
                <div className="producto-image-section">
                    <CarruselImageProduct producto={producto} id={producto._id} />
                </div>

                <div className="producto-info-section">

                    <div className="producto-price-section">
                        <div className="producto-price">{producto.precio} {getMonedaSymbol(producto.moneda)} </div>
                        <div className="price-details">Impuestos incluidos</div>

                    </div>

                    <div className="producto-description">
                        🏷️ DESCRIPCION:
                        <br />
                        {producto.descripcion}
                    </div>
                </div>
            </div>



            <div className="addCarrito-container">
                <div className="producto-stock">Disponibles: {producto.stock}</div>

                <ButtonGroup variant="outlined" aria-label="Controles de cantidad de producto">
                    <Button
                        className="decrementar"
                        onClick={decrementarProducto}
                        aria-label="Disminuir cantidad"
                    >
                        -
                    </Button>
                    <Button disabled aria-label={`Cantidad seleccionada: ${cantidad}`}>{cantidad}</Button>
                    <Button
                        className="incrementar"
                        onClick={incrementarProducto}
                        aria-label="Aumentar cantidad"
                    >
                        +
                    </Button>

                    <button
                        className="addCarrito"
                        onClick={addCarrito}
                        disabled={cantidad === 0 || cantidad > producto.stock}
                        aria-label={`Agregar ${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} al carrito`}
                    >
                        AGREGAR AL CARRITO
                    </button>
                </ButtonGroup>
            </div>
        </div>
    );
};

ProductoDetailPage.propTypes = {
    productos: PropTypes.array.isRequired,
    carrito: PropTypes.array.isRequired,
    actualizarCarrito: PropTypes.func.isRequired
};

export default ProductoDetailPage;

