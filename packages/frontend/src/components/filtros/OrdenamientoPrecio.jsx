import React from 'react'
import PropTypes from 'prop-types'
import './OrdenamientoPrecio.css'
import { FaAngleDown } from 'react-icons/fa';


const OrdenamientoPrecio = ({ ordenPrecio, setOrdenPrecio }) => {
    return (
        <div className="contenedor-ordenamiento">
            <label htmlFor="orden-precio" className="etiqueta-ordenamiento">
                Orden de precio:
            </label>
            <div className="contenedor-select">
                <select
                    id="orden-precio"
                    className="selector-ordenamiento"
                    value={ordenPrecio}
                    onChange={(e) => setOrdenPrecio(e.target.value)}
                    aria-label="Ordenar productos por precio"
                >
                    <option value="asc">Ascendente</option>
                    <option value="desc">Descendente</option>
                </select>
                <FaAngleDown className="icono-flecha" />
            </div>
        </div>

    )
}

OrdenamientoPrecio.propTypes = {
    ordenPrecio: PropTypes.string.isRequired,
    setOrdenPrecio: PropTypes.func.isRequired
}

export default OrdenamientoPrecio