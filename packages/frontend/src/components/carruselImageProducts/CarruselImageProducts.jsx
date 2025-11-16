import React from "react";
import PropTypes from "prop-types";
import "./CarruselImageProducts.css";

export default function CarruselImageProduct({ producto, id }) {
    const fotos = producto.fotos || [];

    if (!fotos.length) return <p className="mensaje-sin-fotos">No hay fotos disponibles</p>;

    return (
        <div
            id={id}
            className="carousel slide contenedor-carrusel"
            data-bs-ride="carousel"
        >
            {/* Indicadores */}
            <div className="carousel-indicators">
                {fotos.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        data-bs-target={`#${id}`}
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-current={index === 0 ? "true" : "false"}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Slides */}
            <div className="carousel-inner carrusel-interior-personalizado">
                {fotos.map((foto, index) => (
                    <div
                        key={index}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                        <img
                            src={`/images/${foto}`}
                            className="imagen-carrusel"
                            alt={`${producto.titulo}`}
                        />
                    </div>
                ))}
            </div>

            {/* Controles */}
            <button
                className="carousel-control-prev control-carrusel-prev-personalizado"
                type="button"
                data-bs-target={`#${id}`}
                data-bs-slide="prev"
                aria-label="Imagen anterior"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
            </button>

            <button
                className="carousel-control-next control-carrusel-next-personalizado"
                type="button"
                data-bs-target={`#${id}`}
                data-bs-slide="next"
                aria-label="Imagen siguiente"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Siguiente</span>
            </button>
        </div>
    );
};

CarruselImageProduct.propTypes = {
    producto: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
};
