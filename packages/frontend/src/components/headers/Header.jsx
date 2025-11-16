import React from 'react'
import './Header.css'
import PropTypes from 'prop-types';
import Navbar from '../navbar/Navbar';

const Header = ({ nombre, carrito, filtrarProductos }) => {
    

    return (
        <header className="header">
            {nombre} 20% OFF si sos estudiante! 🤓📚
            <Navbar carrito={carrito} filtrarProductos={filtrarProductos} />
        </header>
    )
}

Header.propTypes = {
    nombre: PropTypes.string.isRequired
};


export default Header
