import axios from "axios"

const URL_BACKEND = process.env.REACT_APP_URL_BACKEND
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'

export const getUser = async (id) => {
    const user = await axios.get(`${API_BASE_URL}/usuarios/${id}`)
    return user.data
}

export const traerNotificaciones = async (id) => {
    const notifs = await axios.get(`${API_BASE_URL}/usuarios/${id}/notificaciones?leida=false`)
    return notifs.data
}