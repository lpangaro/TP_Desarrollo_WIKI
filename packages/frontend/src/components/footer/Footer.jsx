import React from "react";
import "./Footer.css";
import { FaEnvelope, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { FaShop } from "react-icons/fa6";

const Footer = ({ vendedor = null }) => {
    // Datos por defecto para la página Home
    const datosDefault = {
        email: "contacto@tiendasol.com",
        telefono: "+54 9 11 1234-5678",
        direccion: "Siempre Viva 742, Springfield"
    };

    // Usar datos del vendedor si están disponibles, sino usar los por defecto
    const datos = vendedor ? {
        email: vendedor.email || datosDefault.email,
        telefono: vendedor.telefono || datosDefault.telefono,
        nombre: vendedor.nombre || "Vendedor"
    } : datosDefault;

    return (
        <footer className="footer">

            <div className="datos-vendedor">

                <div className="mail-vendedor">
                    <div className="icono-correo"> <FaEnvelope /> </div>
                    <div className="correo"> {datos.email} </div>
                </div>

                <div className="telefono-vendedor">
                    <div className="icono-telefono"> <FaWhatsapp /> </div>
                    <div className="telefono"> {datos.telefono} </div>
                </div>

                {!vendedor && (
                    <div className="direccion-vendedor">
                        <div className="icono-direccion"> <FaShop /> </div>
                        <div className="direccion"> {datos.direccion} </div>
                    </div>
                )}

                {vendedor && (
                    <div className="direccion-vendedor">
                        <div className="icono-direccion"> <FaShop /> </div>
                        <div className="direccion"> {datos.nombre} </div>
                    </div>
                )}
            </div>
            <div className="footer-text"> © 2025 TiendaSol.com - Todos los derechos reservados </div>
        </footer>
    );
};

Footer.propTypes = {
    vendedor: PropTypes.shape({
        nombre: PropTypes.string,
        email: PropTypes.string,
        telefono: PropTypes.string
    })
};

export default Footer;

