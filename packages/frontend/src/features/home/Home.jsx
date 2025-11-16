import './Home.css'
import React, { useState, useEffect } from "react";
import ProductCard from "../../components/productCard/ProductCard";
import { getProductos } from "../../service/productoService";
import OrdenamientoPrecio from '../../components/filtros/OrdenamientoPrecio'
import TipoMoneda from '../../components/filtros/TipoMoneda'
import PropTypes from 'prop-types';
import Loading from "../../components/spinner/spinner";


const Home = ({ productosFiltrados, agregarAlCarrito, searchTerm }) => {

    const [page, setPage] = useState(1);
    const [limitPage, setLimitPage] = useState(8); // cantidad de productos que se muestran por página
    const [prodsPaginados, setProdsPaginados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(100000)
    const [ordenPrecio, setOrdenPrecio] = useState("asc")
    const [moneda, setMoneda] = useState("") // Vacío para mostrar todos por defecto 

    // Cargar productos con los filtros actuales
    const cargarProductos = async (pageNumber) => {
        try {
            const filters = {
                maxPrice,
                minPrice,
                titulo: searchTerm,
                ordenPrecio
            };

            // Solo agregar moneda si hay una seleccionada
            if (moneda) {
                filters.moneda = moneda;
            }

            const data = await getProductos(pageNumber, limitPage, filters);
            setProdsPaginados(data);
        } catch (error) {
            console.error("Error cargando productos:", error);
            setProdsPaginados([]);
        }
    };

    // Cargar productos cuando la página cambia o el término de búsqueda cambia
    useEffect(() => {
        setLoading(true);
        setPage(1); // Resetear a la primera página cuando cambia la búsqueda
        cargarProductos(1).then(() => {
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [searchTerm]); // Solo cuando cambia searchTerm

    // Cargar productos cuando cambia la página (sin resetear la página)
    useEffect(() => {
        setLoading(true);
        cargarProductos(page).then(() => {
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [page]);

    // Aplicar filtros automáticamente cuando cambian
    useEffect(() => {
        setPage(1); // Resetear a la primera página cuando cambian los filtros
        setLoading(true);
        cargarProductos(1).then(() => {
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [minPrice, maxPrice, ordenPrecio, moneda]);

    const nextPage = async () => {
        setPage((prev) => prev + 1);
    };

    const prevPage = async () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    return (
        <>
            {loading ? (
                <Loading message="Cargando productos..." size="large" />
            ) : (
                <div className="d-flex">
                    <aside className="price-filter">
                        <label htmlFor="rango-precio-min" className="etiqueta-filtro">
                            Filtrar por precio
                        </label>
                        <div className="contenedor-rango-precio">
                            {/* Rango para el precio mínimo */}
                            <div className="control-precio">
                                <label htmlFor="rango-precio-min" className="etiqueta-filtro">
                                    Precio mínimo: ${minPrice}
                                </label>
                                <input
                                    type="range"
                                    className="rango-formulario"
                                    id="rango-precio-min"
                                    min="0"
                                    max={maxPrice}
                                    step="1000"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                />
                            </div>

                            {/* Rango para el precio máximo */}
                            <div className="control-precio">
                                <label htmlFor="rango-precio-max" className="etiqueta-filtro">
                                    Precio máximo: ${maxPrice}
                                </label>
                                <input
                                    type="range"
                                    className="rango-formulario"
                                    id="rango-precio-max"
                                    min={minPrice}
                                    max="100000"
                                    step="1000"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                />
                            </div>

                            <OrdenamientoPrecio ordenPrecio={ordenPrecio} setOrdenPrecio={setOrdenPrecio} />

                            {/* Nuevo componente TipoMoneda */}
                            <TipoMoneda moneda={moneda} setMoneda={setMoneda} />
                        </div>
                    </aside>

                    <div className="container">
                        {/* Cards alineadas a la izquierda */}
                        <div className="fila-productos">
                            {
                                prodsPaginados && prodsPaginados.length > 0 ? (
                                    prodsPaginados.map((prod, index) => (
                                        <div key={index} className="columna-producto">
                                            <ProductCard producto={prod} index={index} agregarAlCarrito={agregarAlCarrito} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="mensaje-sin-productos">
                                        <h3>No hay productos disponibles</h3>
                                        <p>Intenta ajustar los filtros de búsqueda o precio</p>
                                    </div>
                                )
                            }
                        </div>

                        {/* Paginación centrada */}
                        <nav aria-label="Navegación de página" className="navegacion-paginacion">
                            <ul className="lista-paginacion">
                                <li className={`item-pagina ${page === 1 ? "deshabilitado" : ""}`}>
                                    <button
                                        className="boton-pagina"
                                        onClick={prevPage}
                                        aria-label="Ir a página anterior"
                                        disabled={page === 1}
                                    >
                                        Anterior
                                    </button>
                                </li>
                                <li className="item-pagina">
                                    <span className="enlace-pagina" aria-current="page" aria-label={`Página ${page}`}>{page}</span>
                                </li>
                                <li className={`item-pagina ${prodsPaginados ? (prodsPaginados.length < limitPage ? "deshabilitado" : "") : "deshabilitado"}`}>
                                    <button
                                        className="boton-pagina"
                                        onClick={nextPage}
                                        aria-label="Ir a página siguiente"
                                        disabled={!prodsPaginados || prodsPaginados.length < limitPage}
                                    >
                                        Siguiente
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

Home.propTypes = {
    productosFiltrados: PropTypes.array.isRequired,
    agregarAlCarrito: PropTypes.func.isRequired,
    searchTerm: PropTypes.string
};

export default Home;