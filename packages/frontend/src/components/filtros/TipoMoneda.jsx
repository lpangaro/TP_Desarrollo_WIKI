import React from 'react'
import PropTypes from 'prop-types'
import './TipoMoneda.css'
import { FaAngleDown } from 'react-icons/fa';

const TipoMoneda = ({ moneda, setMoneda }) => {
    return (
        <div className="contenedor-moneda">
            <label htmlFor="TipoMoneda" className="etiqueta-moneda">
                Moneda:
            </label>
            <div className="contenedor-select">
                <select
                    id="TipoMoneda"
                    className="TipoMoneda"
                    value={moneda}
                    onChange={(e) => setMoneda(e.target.value)}
                    aria-label="Seleccionar tipo de moneda"
                >
                    <option value="">Todas las monedas</option>
                    <option value="ARS">ARS ($)</option>
                    <option value="USD">USD (US$)</option>
                    <option value="BRL">BRL (R$)</option>
                </select>
                <FaAngleDown className="icono-flecha" />
            </div>
        </div>
    )
}

TipoMoneda.propTypes = {
    moneda: PropTypes.string, // Puede ser vacío
    setMoneda: PropTypes.func.isRequired
}

export default TipoMoneda