## ✅ **SOLUCIÓN AL ERROR 404**

El problema era que las rutas no seguían el patrón correcto del proyecto. He realizado los siguientes cambios:

### **Cambios realizados:**

1. **Actualizado `constants/endpoints.js`**:
   - Agregado `COTIZACIONES: "/cotizaciones"`
   - Agregado `CONVERTIR: "/convertir"` en SUB_ROUTES
   - Agregado `COTIZACION_CONVERTIR` en COMPOSED_ROUTES

2. **Actualizado `routers/cotizacionRoutes.js`**:
   - Cambiado de `router.get('/', ...)` a `router.get(ENDPOINTS.COTIZACIONES, ...)`
   - Cambiado de `router.get('/convertir', ...)` a `router.get(COMPOSED_ROUTES.COTIZACION_CONVERTIR, ...)`
   - Agregado manejo de promesas con `.then()` y `.catch()`
   - Agregado `next` para manejo de errores

### **Prueba el endpoint:**

```bash
# Terminal 1 - Iniciar el servidor
cd /c/Users/samat/2025-2c-backend-grupo-02
npm run dev:backend

# Terminal 2 - Probar endpoints
curl "http://localhost:3000/cotizaciones"
curl "http://localhost:3000/cotizaciones/convertir?monto=1000&monedaOrigen=ARS&monedaDestino=USD"
```

### **Endpoints disponibles:**

- `GET /cotizaciones` - Obtiene todas las cotizaciones
- `GET /cotizaciones/convertir?monto={monto}&monedaOrigen={moneda}&monedaDestino={moneda}` - Convierte monto

El servidor debería responder correctamente ahora que las rutas están correctamente configuradas siguiendo el patrón del proyecto.
