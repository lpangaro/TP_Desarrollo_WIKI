import axios from "axios"

export const obtenerPedidos = async (vendedor) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'
    const response = await axios.get(`${API_BASE_URL}/pedidos/vendedor/${vendedor}`)
    return response.data
}

export const actualizarEstado = async (id, body) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'
    const response = await axios.patch(`${API_BASE_URL}/pedidos/${id}`, body)
    return response.data
}

export const obtenerPedidosPorUsuario = async (userId) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'
    const response = await axios.get(`${API_BASE_URL}/pedidos/user/${userId}/history`)
    return response.data
}