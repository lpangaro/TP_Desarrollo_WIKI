import { Outlet } from "react-router";
import React, { useState } from "react";
import Header from "../../components/headers/Header.jsx";
import Navbar from "../../components/navbar/Navbar.jsx"
import Footer from "../../components/footer/Footer.jsx";
import './Layout.css'
import PropTypes from 'prop-types';

const Layout = ({ carrito = [], filtrarProductos }) => {
    const [vendedor, setVendedor] = useState(null);

    return (
        <>
            <Header nombre="Lucas" carrito={carrito} filtrarProductos={filtrarProductos}></Header>
            {/* <Navbar carrito={carrito} filtrarProductos={filtrarProductos}></Navbar> */}
            <Outlet context={{ setVendedor }}></Outlet>
            <Footer vendedor={vendedor}></Footer>
        </>
    )
}

Layout.propTypes = {
    carrito: PropTypes.array,
    filtrarProductos: PropTypes.func.isRequired
};

export default Layout;