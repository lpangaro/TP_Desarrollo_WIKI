// import { Link } from 'react-router';
import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
import '../navbar/Navbar.css';
import { FaHippo, FaShoppingCart } from 'react-icons/fa'
import '../../index.css'
import { FaBagShopping, FaUserPlus, FaRightToBracket } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AccommodationSearchBar from '../accommodationSearchBar/AccommodationSearchBar';
import { useAppContext } from '../../context/AppContext';
import { FiLogOut } from "react-icons/fi";
import { IoIosNotifications } from "react-icons/io";
import { traerNotificaciones } from '../../service/userService';
import { FaCheckCircle } from 'react-icons/fa';
import { marcarNotifComoLeida } from '../../service/notifService';
import PropTypes from 'prop-types';

const Navbar = ({ carrito, filtrarProductos }) => {
    const navigate = useNavigate();
    const [cantProductos, setCantProductos] = useState(0);
    const { user, logoutUser } = useAppContext()
    const [notificaciones, setNotificaciones] = useState([])

    const irAlCarrito = () => {
        navigate('/carrito');
    };

    const cantProductosEnCarrito = () => {
        return carrito.length;
    };

    useEffect(() => {
        setCantProductos(cantProductosEnCarrito());
    }, [carrito]);

    useEffect(() => {
        if (!user) return;

        const fetchNotificaciones = async () => {
            try {
                const notifs = await traerNotificaciones(user._id);
                console.log("Notifs desde backend:", notifs); // para verificar
                setNotificaciones(notifs); // notifs ya es un array
            } catch (error) {
                console.error("Error al traer notificaciones:", error);
            }
        };

        fetchNotificaciones();
    }, [user]);

    const leerNotificacion = async (notif) => {
        await marcarNotifComoLeida(notif)
        setNotificaciones(prev =>
            prev.filter(n => n._id !== notif._id)
        )
    }

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <span className="navbar-logo-text">TiendaSol.com</span>
                    <img
                        src="/logo192.png"
                        alt="TiendaSol Logo"
                        className="navbar-logo-img"
                    />
                </Link>
            </div>

            <div className="navbar-center">
                <AccommodationSearchBar filtrarProductos={filtrarProductos} />
            </div>

            <div className="navbar-right gap-3">
                <Link to="/carrito" className="navbar-cart">
                    <FaBagShopping />
                    {carrito && cantProductosEnCarrito() > 0 && (
                        <span className="cart-count">{cantProductosEnCarrito()}</span>
                    )}
                </Link>
                {user ? (
                    <>
                        <div className="accordion-container d-flex">
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        {notificaciones.length > 0 ? (
                                            // Botón con notificación
                                            <button
                                                type="button"
                                                className="btn btn-primary position-relative"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-expanded="false"
                                                aria-controls="collapseOne"
                                            >
                                                <IoIosNotifications size={22} />
                                                <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                                                    <span className="visually-hidden">New alerts</span>
                                                </span>
                                            </button>
                                        ) : (
                                            // Botón "normal" sin notificación
                                            <button
                                                type="button"
                                                className="btn"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-expanded="false"
                                                aria-controls="collapseOne"
                                            >
                                                <IoIosNotifications size={22} />
                                            </button>
                                        )}



                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            {notificaciones.length === 0 && <p>No hay notificaciones</p>}
                                            {notificaciones.map((notif) => (
                                                <div key={notif._id} className="notif-item d-flex align-items-center justify-content-between">
                                                    <div className='msj-notif'>
                                                        <p className=''>{notif.mensaje}</p>
                                                        <small>{new Date(notif.fechaAlta).toLocaleString()}</small>
                                                    </div>
                                                    <button onClick={() => { leerNotificacion(notif) }}>
                                                        <FaCheckCircle />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="navbar-auth">
                            {user.tipo === 'VENDEDOR' && (
                                <button className="navbar-auth-btn" onClick={() => { navigate(`/productos/vendedor/${user._id}`) }}>{user.nombre}</button>
                            )}
                            {user.tipo === 'COMPRADOR' && (
                                <button className="navbar-auth-btn" onClick={() => { navigate('/mi-perfil') }}>{user.nombre}</button>
                            )}
                            <button onClick={() => { logoutUser(); navigate('/') }} className='bg-danger text-light p-2 rounded-2'>Salir <FiLogOut /></button>
                        </div>
                    </>
                ) : (
                    <div className="navbar-auth">
                        <button className="navbar-auth-btn" onClick={() => { navigate('/register') }}>
                            <FaUserPlus className="navbar-auth-icon" />
                            Registrarse
                        </button>
                        <button className="navbar-auth-btn" onClick={() => navigate('/login')}>
                            <FaRightToBracket className="navbar-auth-icon" />
                            Iniciar Sesión
                        </button>
                    </div>
                )}
            </div>


        </nav>
    );
};

export default Navbar;

Navbar.propTypes = {
    carrito: PropTypes.array.isRequired,
    filtrarProductos: PropTypes.func.isRequired
};
