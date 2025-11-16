import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

export default function Register() {

    const URL_BACKEND = process.env.REACT_APP_API_URL
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
        tipo: "",
    });

    const [errors, setErrors] = useState({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
        tipo: "",
    });

    // Validar email con regex
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validar contraseña: entre 5-10 caracteres, al menos 1 letra y 1 número
    const isValidPassword = (password) => {
        if (password.length < 5 || password.length > 10) return false;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return hasLetter && hasNumber;
    };

    // Validar teléfono: solo números, entre 7-15 dígitos
    const isValidPhone = (phone) => {
        const phoneRegex = /^[0-9]{7,15}$/;
        return phoneRegex.test(phone.replace(/\s|-|\+/g, ""));
    };

    // Validar nombre: al menos 2 caracteres
    const isValidName = (name) => {
        return name.trim().length >= 2;
    };

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "nombre":
                if (!value.trim()) {
                    error = "El nombre es obligatorio";
                } else if (!isValidName(value)) {
                    error = "El nombre debe tener al menos 2 caracteres";
                }
                break;

            case "email":
                if (!value.trim()) {
                    error = "El correo es obligatorio";
                } else if (!isValidEmail(value)) {
                    error = "Ingresa un correo válido (ej: usuario@example.com)";
                }
                break;

            case "password":
                if (!value) {
                    error = "La contraseña es obligatoria";
                } else if (!isValidPassword(value)) {
                    error = "La contraseña debe tener 5-10 caracteres, al menos 1 letra y 1 número";
                }
                break;

            case "telefono":
                if (!value.trim()) {
                    error = "El teléfono es obligatorio";
                } else if (!isValidPhone(value)) {
                    error = "El teléfono debe contener 7-15 dígitos";
                }
                break;

            case "tipo":
                if (!value || value === "") {
                    error = "Debes seleccionar un tipo de usuario";
                }
                break;

            default:
                break;
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validación en tiempo real
        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar todos los campos
        const newErrors = {};
        Object.keys(formData).forEach((field) => {
            const error = validateField(field, formData[field]);
            newErrors[field] = error;
        });

        setErrors(newErrors);

        // Si hay errores, no enviar
        const hasErrors = Object.values(newErrors).some((error) => error !== "");
        if (hasErrors) {
            toast.warning("Por favor, corrige los errores en el formulario");
            return;
        }

        try {
            // Normalizar el campo 'tipo' a mayúsculas
            const tipoNormalizado = formData.tipo.trim().toUpperCase();

            // Datos normalizados
            const dataNormalizada = { ...formData, tipo: tipoNormalizado };

            console.log("Datos del formulario:", dataNormalizada);

            await axios.post(`${URL_BACKEND}/usuarios`, dataNormalizada);
            toast.success(`¡Registrado exitosamente como ${tipoNormalizado}!`);

            // Limpiar campos después de un tiempo
            setTimeout(() => {
                setFormData({
                    nombre: "",
                    email: "",
                    password: "",
                    telefono: "",
                    tipo: "",
                });
                setErrors({
                    nombre: "",
                    email: "",
                    password: "",
                    telefono: "",
                    tipo: "",
                });
            }, 1500);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Ocurrió un error al registrarse. Intenta nuevamente.";
            toast.error(errorMsg);
        }
    };


    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                <h2 className="mb-4 text-center">Formulario de Registro</h2>

                <form
                    onSubmit={handleSubmit}
                    className="border p-4 rounded shadow-sm bg-light"
                >
                    {/* Nombre */}
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre completo</label>
                        <input
                            type="text"
                            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                            id="nombre"
                            name="nombre"
                            placeholder="Ej. Juan Pérez"
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                        {errors.nombre && (
                            <small className="text-danger d-block mt-1">{errors.nombre}</small>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            id="email"
                            name="email"
                            placeholder="Ej. juan@mail.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <small className="text-danger d-block mt-1">{errors.email}</small>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            id="password"
                            name="password"
                            placeholder="5-10 caracteres (letra y número)"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <small className="text-danger d-block mt-1">{errors.password}</small>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div className="mb-3">
                        <label htmlFor="telefono" className="form-label">Teléfono</label>
                        <input
                            type="tel"
                            className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                            id="telefono"
                            name="telefono"
                            placeholder="Ej. +34 600 123 456"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                        {errors.telefono && (
                            <small className="text-danger d-block mt-1">{errors.telefono}</small>
                        )}
                    </div>

                    {/* Tipo de usuario */}
                    <div className="mb-3">
                        <label htmlFor="tipo" className="form-label">Tipo de usuario</label>
                        <select
                            className={`form-select ${errors.tipo ? "is-invalid" : ""}`}
                            id="tipo"
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona</option>
                            <option value="COMPRADOR">Comprador</option>
                            <option value="VENDEDOR">Vendedor</option>
                        </select>
                        {errors.tipo && (
                            <small className="text-danger d-block mt-1">{errors.tipo}</small>
                        )}
                    </div>

                    {/* Botón */}
                    <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                </form>
            </div>
        </div>
    );
}

Register.propTypes = {
    formData: PropTypes.shape({
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired,
        tipo: PropTypes.string.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,

};