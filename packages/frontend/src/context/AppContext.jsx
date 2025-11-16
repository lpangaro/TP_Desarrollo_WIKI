import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode'
// Crear el contexto
const AppContext = createContext();

// Provider
export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    // Función para login

    const loginUser = (token) => {
        const payload = jwtDecode(token);

        setUser({
            _id: payload._id,
            nombre: payload.nombre,
            tipo: payload.tipo,
            email: payload.email
        });

        localStorage.setItem("token", token);

        // Calculamos el tiempo restante hasta que expire
        const timeout = payload.exp * 1000 - Date.now();
        setTimeout(logoutUser, timeout);
    };

    // Efecto para inicializar el usuario si hay token en localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        const payload = jwtDecode(token);

        // Si el token ya expiró, lo eliminamos
        if (Date.now() > payload.exp * 1000) {
            logoutUser();
        } else {
            setUser({
                _id: payload._id,
                nombre: payload.nombre,
                tipo: payload.tipo,
                email: payload.email
            });

            // Programamos logout automático
            const timeout = payload.exp * 1000 - Date.now();
            setTimeout(logoutUser, timeout);
        }
    }, [])

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    }

    return (
        <AppContext.Provider value={{ user, logoutUser, loginUser }}>
            {children}
        </AppContext.Provider>
    );
}

// ✅ Hook personalizado con nombre correcto
export function useAppContext() {
    return useContext(AppContext);
}
