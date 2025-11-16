import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"
import { useAppContext } from '../../context/AppContext'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import React from "react";
import './Login.css'

export default function Login() {
  const URL_BACKEND = process.env.REACT_APP_API_URL || "http://localhost:3000";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loginUser } = useAppContext()
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.warning("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await axios.post(`${URL_BACKEND}/usuarios/login`, formData);

      const token = response.data.token;
      const payload = jwtDecode(token);
      loginUser(token)
      toast.success(`¡Bienvenido ${payload.nombre}!`);

      setTimeout(() => {
        navigate("/"); // Redirigimos al home
      }, 1000);


    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Error al iniciar sesión"
      toast.error(message);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
        <h2 className="mb-4 text-center">Iniciar Sesión</h2>

        <form
          onSubmit={handleSubmit}
          className="border p-4 rounded shadow-sm bg-light"
        >
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Ej. juan@mail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Botón */}
          <button type="submit" className="btn btn-primary w-100">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};