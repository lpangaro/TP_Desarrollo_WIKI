import React, { useState, useEffect } from 'react'
import { useParams, useOutletContext } from "react-router-dom"
import { getProductsByUser } from '../../service/productoService.js'
import { getUser } from '../../service/userService.js'
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap'
import ProductCard from '../productCard/ProductCard'
import PropTypes from 'prop-types';
import "./PerfilVendedor.css"
import { useAppContext } from "../../context/AppContext"
import axios from "axios"
import { obtenerPedidos, actualizarEstado } from '../../service/pedidoService.js'

const PerfilVendedor = ({ carrito, agregarAlCarrito }) => {
    const { id } = useParams()
    const [prods, setProds] = useState([])
    const [userPerfil, setUserPerfil] = useState(null)
    const { setVendedor } = useOutletContext()
    const { user } = useAppContext()
    const [abrirFormulario, setAbrirFormulario] = useState(false)
    const [error, setError] = useState("")
    const [erroresPorPedido, setErroresPorPedido] = useState({});

    const [pedidos, setPedidos] = useState(null)
    const [estadoPedidos, setEstadoPedidos] = useState({});


    const [producto, setProducto] = useState({
        vendedor: id,
        titulo: '',
        descripcion: '',
        categorias: [''],
        precio: 0,
        moneda: 'PESO_ARG',
        stock: 0,
        fotos: ['']
    });
    const [mostrar, setMostrar] = useState("productos")

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setProducto({
            ...producto,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
        });
    };

    const handleCategoriaChange = (index, value) => {
        const nuevasCategorias = [...producto.categorias];
        nuevasCategorias[index] = value;
        setProducto({ ...producto, categorias: nuevasCategorias });
    };

    const handleFotoChange = (index, value) => {
        const nuevasFotos = [...producto.fotos];
        nuevasFotos[index] = value;
        setProducto({ ...producto, fotos: nuevasFotos });
    };

    const agregarCategoria = () => {
        setProducto({ ...producto, categorias: [...producto.categorias, ''] });
    };

    const eliminarCategoria = (index) => {
        const nuevasCategorias = producto.categorias.filter((_, i) => i !== index);
        setProducto({ ...producto, categorias: nuevasCategorias });
    };

    const agregarFoto = () => {
        setProducto({ ...producto, fotos: [...producto.fotos, ''] });
    };

    const eliminarFoto = (index) => {
        const nuevasFotos = producto.fotos.filter((_, i) => i !== index);
        setProducto({ ...producto, fotos: nuevasFotos });
    };

    const handleSubmit = async (e) => {
        const API_BASE_URL = process.env.REACT_APP_API_URL
        e.preventDefault();
        try {
            const respuesta = await axios.post(`${API_BASE_URL}/productos`, producto, {
                headers: { 'Content-Type': 'application/json' }
            });

            toast.success('✅ Producto agregado con éxito!');
            console.log('Respuesta del servidor:', respuesta.data);

            // Reiniciar formulario
            setProducto({
                vendedor: id,
                titulo: '',
                descripcion: '',
                categorias: [''],
                precio: 0,
                moneda: 'ARS',
                stock: 0,
                fotos: ['']
            });
        } catch (error) {
            console.error('Error al enviar el producto:', error);
            toast.error('❌ Ocurrió un error al enviar el producto. Ver consola.');
            setErroresPorPedido(prev => ({ ...prev, [id]: error.response?.data?.mensaje || error.message }));

        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodsPorVendedor = await getProductsByUser(id)
                setProds(prodsPorVendedor)

                const userData = await getUser(id)
                setUserPerfil(userData)

                // Actualizar el footer con los datos del vendedor
                setVendedor(userData)
            } catch (error) {
                console.error("Error fetching data: ", error)
            }
        }

        fetchData()

        // Limpiar el vendedor cuando el componente se desmonte
        return () => {
            setVendedor(null)
        }
    }, [id, setVendedor]) // Asegúrate de agregar 'id' y 'setVendedor' a las dependencias

    // Si 'user' es null, muestra un mensaje de carga
    if (!userPerfil) {
        return (
            <div className="spinner text-center">
                <div>Cargando...</div>
                <div><Spinner /></div>
            </div>
        )
    }

    const traerPedidos = async () => {
        setMostrar("pedidos");
        const pedidos = await obtenerPedidos(id);
        setPedidos(pedidos);
    };


    const actualizarEstadoPedido = async (id) => {
        try {
            const body = { "estado": estadoPedidos[id] || "enviado", "motivo": "asd" };
            await actualizarEstado(id, body);
            // Limpiar el error solo de este pedido
            setErroresPorPedido(prev => ({ ...prev, [id]: "" }));
            toast.success("✅ Estado actualizado con éxito");
        } catch (error) {
            setErroresPorPedido(prev => ({ ...prev, [id]: error.response.data.message }));
            toast.error("Error al actualizar el estado del pedido");
        }
    };


    return (
        <div className='container'>
            <h1 className='text-center'>{userPerfil.nombre}</h1>
            {user && user._id === id && (
                <div className='d-flex gap-1'>
                    <button className='bg-primary text-white p-3' onClick={() => { setMostrar("productos") }}>Productos</button>
                    <button className='bg-primary text-white p-3' onClick={traerPedidos}>Pedidos</button>
                    <button className="bg-primary text-white p-3" onClick={() => setAbrirFormulario(true)}>Agregar producto</button>

                </div>
            )}

            {
                mostrar === "productos" ? (
                    <>
                        {/* === Botón y formulario de agregar producto (solo para el vendedor) === */}
                        {user && user._id === id && (
                            <>


                                {abrirFormulario && (
                                    <div className="position-relative p-2">
                                        <form className="formulario-producto" onSubmit={handleSubmit}>
                                            <h2>Agregar Producto</h2>

                                            <label>Título:</label>
                                            <input
                                                type="text"
                                                name="titulo"
                                                value={producto.titulo}
                                                onChange={handleChange}
                                                required
                                            />

                                            <label>Descripción:</label>
                                            <textarea
                                                name="descripcion"
                                                value={producto.descripcion}
                                                onChange={handleChange}
                                                required
                                            />

                                            <label>Precio:</label>
                                            <input
                                                type="number"
                                                name="precio"
                                                value={producto.precio}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                required
                                            />

                                            <label>Moneda:</label>
                                            <select
                                                name="moneda"
                                                value={producto.moneda}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="PESO_ARG">ARS</option>
                                                <option value="DOLAR">USD</option>
                                                <option value="REAL">BRL</option>
                                            </select>

                                            <label>Stock:</label>
                                            <input
                                                type="number"
                                                name="stock"
                                                value={producto.stock}
                                                onChange={handleChange}
                                                min="0"
                                                required
                                            />

                                            {/* === Categorías === */}
                                            <div className="grupo-dinamico">
                                                <h4>Categorías:</h4>
                                                {producto.categorias.map((cat, i) => (
                                                    <div className="campo-dinamico" key={i}>
                                                        <input
                                                            type="text"
                                                            value={cat}
                                                            onChange={(e) => handleCategoriaChange(i, e.target.value)}
                                                            placeholder={`Categoría ${i + 1}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn-eliminar"
                                                            onClick={() => eliminarCategoria(i)}
                                                        >
                                                            ❌
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="btn-secundario"
                                                    onClick={agregarCategoria}
                                                >
                                                    ➕ Agregar otra categoría
                                                </button>
                                            </div>

                                            {/* === Fotos === */}
                                            <div className="grupo-dinamico">
                                                <h4>Fotos (URLs):</h4>
                                                {producto.fotos.map((foto, i) => (
                                                    <div className="campo-dinamico" key={i}>
                                                        <input
                                                            type="text"
                                                            value={foto}
                                                            onChange={(e) => handleFotoChange(i, e.target.value)}
                                                            placeholder={`URL de foto ${i + 1}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn-eliminar"
                                                            onClick={() => eliminarFoto(i)}
                                                        >
                                                            ❌
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="btn-secundario"
                                                    onClick={agregarFoto}
                                                >
                                                    📸 Agregar otra foto
                                                </button>
                                            </div>

                                            <button type="submit" className="btn-principal">
                                                ✅ Guardar Producto
                                            </button>
                                        </form>

                                        <button
                                            type="button"
                                            className="position-absolute top-0 end-0 m-2 btn bg-danger text-white"
                                            onClick={() => setAbrirFormulario(false)}
                                        >
                                            Cerrar formulario
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* === Productos visibles para todos === */}
                        <div className="row justify-content-start gy-4 mt-3">
                            {prods && prods.length > 0 ? (
                                prods.map((prod, index) => (
                                    <div
                                        key={index}
                                        className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-start"
                                    >
                                        <ProductCard
                                            producto={prod}
                                            index={index}
                                            agregarAlCarrito={agregarAlCarrito}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No hay productos disponibles</p>
                            )}
                        </div>
                    </>
                ) : pedidos && pedidos.length > 0 ? (
                    <div className="row g-3 mt-3">
                        {pedidos.map((pedido) => (
                            <div key={pedido._id} className="col-12 col-md-6 col-lg-4">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-header bg-primary text-white">
                                        Pedido #{pedido._id}
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1"><strong>Comprador:</strong> {pedido.comprador.nombre}</p>
                                        <p className="mb-1"><strong>Email:</strong> {pedido.comprador.email}</p>
                                        <p className="mb-1">
                                            <strong>Dirección:</strong> {pedido.direccionEntrega.calle} {pedido.direccionEntrega.altura}
                                        </p>
                                        <p className="mb-2"><strong> Estado: </strong>{pedido.estado}</p>
                                    </div>

                                    <div className="card-footer d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-2">
                                            <>
                                                <label className="mb-0">Marcar como:</label>
                                                <select
                                                    className="form-select w-auto"
                                                    value={estadoPedidos[pedido._id] || "enviado"}
                                                    onChange={(e) =>
                                                        setEstadoPedidos({
                                                            ...estadoPedidos,
                                                            [pedido._id]: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value="enviado">Enviado</option>
                                                    <option value="cancelado">Cancelado</option>
                                                </select>

                                            </>

                                        </div>
                                        <button
                                            className="btn btn-success btn-sm"
                                            disabled={pedido.estado === 'Entregado'}
                                            onClick={() => actualizarEstadoPedido(pedido._id)}
                                        >
                                            Actualizar
                                        </button></div>
                                    {erroresPorPedido[pedido._id] && (
                                        <p className="text-danger">{erroresPorPedido[pedido._id]}</p>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-3">No hay pedidos</p>
                )}



        </div >
    )
};

PerfilVendedor.propTypes = {
    carrito: PropTypes.array.isRequired,
    agregarAlCarrito: PropTypes.func.isRequired
};

export default PerfilVendedor