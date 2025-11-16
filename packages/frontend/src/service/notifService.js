import axios from "axios"

export const marcarNotifComoLeida = async (notif) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'
    await axios.patch(`${API_BASE_URL}/notificaciones/${notif._id}`, { leida: true })
}