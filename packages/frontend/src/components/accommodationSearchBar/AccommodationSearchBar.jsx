import React from 'react'
import './AccommodationSearchBar.css';
import { FaComment, FaMapMarkerAlt, FaSearch, FaTag } from 'react-icons/fa';
import { Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import TextType from "../TextType/index.jsx";
import { getProductos } from '../../service/productoService.js';

const AccomodationSearchBar = ({ filtrarProductos }) => {
    const [searchText, setSearchText] = useState("");
    const [focused, setFocused] = useState(false);
    const [palabras, setPalabras] = useState([]);
    const navigate = useNavigate();

    // Cargar los títulos de los productos para la animación del placeholder
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const productos = await getProductos();
                const titulos = productos.map(p => p.titulo);
                setPalabras(titulos);
            } catch (error) {
                console.error("Error cargando productos:", error);
                setPalabras([]); // Array vacío en caso de error
            }
        };
        cargarProductos();
    }, []);

    const handleSearch = () => {
        filtrarProductos(searchText);
        navigate('/'); // redirige a la página de inicio para mostrar los resultados
    };

    const handleKeyPress = (e) => { // Detecta la tecla Enter en vez del botón buscar, mas aesthetic
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className='search-field'>
            <div className='input-wrapper'>
                <FaTag className='tag-icon' />

                <div className={`animated-placeholder-wrapper ${focused || searchText ? 'has-value' : ''}`}>
                    <div className="animated-placeholder">
                        {palabras.length > 0 && (<TextType
                            text={palabras}
                            className="placeholder-typetype"
                        />
                        )}
                    </div>
                </div>

                <TextField
                    value={searchText}
                    onChange={(e) => { setSearchText(e.target.value) }}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    fullWidth
                    variant="standard"
                    placeholder={"Busca"}
                    InputProps={{
                        disableUnderline: true,
                    }}
                />
            </div>
        </div>


    )
}

AccomodationSearchBar.propTypes = {
    filtrarProductos: PropTypes.func.isRequired
};

export default AccomodationSearchBar

