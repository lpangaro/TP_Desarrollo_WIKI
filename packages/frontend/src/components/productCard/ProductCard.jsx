import React from "react";
import CarruselImageProduct from "../carruselImageProducts/CarruselImageProducts.jsx";
import { Link } from "react-router";
import PropTypes from "prop-types";
import "./ProductCard.css";
import { getMonedaSymbol } from "../../utils/Monedas.js";
import { FaBagShopping, FaCartShopping } from 'react-icons/fa6';
import { useAppContext} from '../../context/AppContext'

const ProductCard = ({ producto, index, agregarAlCarrito }) => {
    
    return (
        <div className="tarjeta">
            <CarruselImageProduct producto={producto} id={`carousel-${index}`} />

            <div className="cuerpo-tarjeta">
                <div>
                    <h3 className="titulo-producto">{producto.titulo}</h3>
                    <p className="descripcion-producto">{producto.descripcion}</p>

                    <div className="contenedor-categorias">
                        {producto.categorias.map((cat, i) => (
                            <span key={i} className="etiqueta-categoria">
                                {cat}
                            </span>
                        ))}
                    </div>

                    <p className="stock-producto">
                        Stock disponible: {producto.stock} unidades
                    </p>

                    <p className="precio-producto">
                        {getMonedaSymbol(producto.moneda)}
                        {producto.precio}
                    </p>

                    <p className="vendedor-producto">
                        Vendido por:
                        <Link
                            to={`/productos/vendedor/${producto.vendedor._id}`}
                            className="link-vendedor"
                        >
                            {producto.vendedor.nombre}
                        </Link>
                    </p>
                </div>

                <div className="contenedor-acciones">


                    <Link to={`/producto/${producto._id}`} className="boton-detalles" aria-label={`Ver detalles de ${producto.titulo}`}>
                        Ver Detalles
                    </Link>


                    <button
                        className="boton-agregar-carrito"
                        onClick={() => agregarAlCarrito(producto)}
                        aria-label={`Agregar ${producto.titulo} al carrito`}
                    >
                        <FaCartShopping color="white" className="icono-carrito" />
                    </button>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    producto: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    agregarAlCarrito: PropTypes.func.isRequired
};

export default ProductCard;