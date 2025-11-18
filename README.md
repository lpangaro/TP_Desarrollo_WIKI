# Plan: Sistema de Calificación y Reseñas para Vendedores

Agregar funcionalidad completa para que compradores puedan calificar (1-5 estrellas) y dejar reseñas a vendedores después de completar una compra. Los vendedores mostrarán su calificación promedio y lista de reseñas en su perfil.

## Steps

1. **Crear modelo y schema de reseñas** en `packages/backend/domain/resenas/Resena.js` y `packages/backend/schemas/resenaSchema.js`, incluyendo validación Zod en `validators.js` con campos: `vendedor`, `comprador`, `pedido`, `calificacion` (1-5), `comentario` y `fechaCreacion`

2. **Actualizar schema de Usuario** en `usuarioSchema.js` agregando campos `promedioCalificacion` (0-5) y `cantidadResenas`, y modificar `Usuario.js`

3. **Implementar capa de datos** creando `ResenaRepository` en `packages/backend/repositories/resenaRepository.js` con métodos: `save()`, `findByVendedor()`, `findByPedido()`, y `countByVendedor()`

4. **Crear servicio de reseñas** en `packages/backend/services/resenaService.js` con lógica de negocio: validar pedido entregado, prevenir reseñas duplicadas, crear reseña, y actualizar promedio del vendedor en `UsuarioService`

5. **Implementar API endpoints** creando `ResenaController` en `packages/backend/controllers/resenaController.js`, `resenaRouter` en `packages/backend/routers/resenaRouter.js`, errores custom en `packages/backend/errors/resenasErrors/`, registrar en `endpoints.js` y `routers.js`

6. **Crear servicio frontend** en `packages/frontend/src/service/resenaService.js` con funciones `crearResena()` y `obtenerResenasPorVendedor()`

7. **Desarrollar componentes UI** creando `StarRating.jsx` (mostrar/seleccionar estrellas), `ResenaCard.jsx` (mostrar reseña individual), y `ResenaForm.jsx` (formulario modal para crear reseña) en `components`

8. **Integrar en perfil del comprador** modificando `PerfilComprador.jsx` para agregar botón "Dejar Reseña" en pedidos entregados sin reseña, y modal con `ResenaForm`

9. **Integrar en perfil del vendedor** modificando `PerfilVendedor.jsx` para mostrar `promedioCalificacion` y `cantidadResenas` en header, y lista paginada de reseñas usando `ResenaCard`

10. **Actualizar dependencias y registro** en `index.js` instanciar `ResenaRepository`, `ResenaService`, y `ResenaController`, registrarlos en el servidor

## Further Considerations

- **Reglas de negocio:** ¿Debe haber un límite de tiempo después de la entrega para dejar reseña? ¿Los vendedores pueden responder a las reseñas?

- **Edición/eliminación:** ¿Los compradores pueden editar o eliminar sus reseñas después de publicarlas? ¿Requiere esto auditoría con historial de cambios?

- **Moderación:** ¿Se necesita un sistema de reportes para reseñas inapropiadas? ¿Validación de lenguaje ofensivo en comentarios?

- **Tests:** ¿Agregar tests unitarios en `test` y tests de integración para los nuevos endpoints de reseñas?

- **Migraciones:** ¿Cómo manejar usuarios y pedidos existentes? ¿Ejecutar script para inicializar `promedioCalificacion: 0` y `cantidadResenas: 0` en vendedores actuales?

# Plan: Sistema de Calificación y Reseñas para Vendedores

Sistema completo para que compradores califiquen (1-5 estrellas) y dejen reseñas a vendedores después de completar una compra. Los vendedores mostrarán su calificación promedio y lista paginada de reseñas en su perfil.

---

## 📋 ARQUITECTURA Y FLUJO GENERAL

### **BACKEND - Flujo de Datos (Arquitectura en Capas)**

```
1. Cliente HTTP (Frontend) → 
2. Router (Express) → valida JWT y parsea request →
3. Controller → valida datos con Zod →
4. Service → orquesta lógica de negocio y coordina repositorios →
5. Repository → interactúa con MongoDB via Mongoose →
6. Database (MongoDB) → persiste datos en colección "resenas"
```

**Retorno (Promises):**
```
Database → Repository (Promise) → 
Service (Promise + transformaciones) → 
Controller (Promise) → 
Router (.then/.catch para status HTTP) → 
Cliente (JSON response)
```

### **FRONTEND - Flujo de Datos (React + REST)**

```
1. Componente React (useEffect mount o click) →
2. Service (Axios HTTP Request REST) →
3. Backend API (HTTP verbs: GET, POST, PUT, DELETE) →
4. Service recibe response (Promise) →
5. Componente actualiza estado (useState) →
6. React re-renderiza UI
```

---

## 🗂️ CAPAS Y ARCHIVOS DETALLADOS

### **BACKEND**

#### **1. DOMINIO** (Modelos de negocio, clases JavaScript)

| Archivo | Descripción | Contenido |
|---------|-------------|-----------|
| `packages/backend/domain/resenas/Resena.js` | Clase de dominio para Reseña | Constructor con: `id`, `vendedor`, `comprador`, `pedido`, `calificacion` (1-5), `comentario`, `fechaCreacion`. Representa la entidad de negocio. |
| `packages/backend/domain/usuarios/Usuario.js` | **MODIFICAR**: Agregar propiedades | Agregar en constructor: `promedioCalificacion = 0`, `cantidadResenas = 0` |

#### **2. SCHEMAS** (MongoDB/Mongoose - Persistencia)

| Archivo | Descripción | Contenido |
|---------|-------------|-----------|
| `packages/backend/schemas/resenaSchema.js` | Schema Mongoose para colección "resenas" | `vendedor: ObjectId ref usuarios`, `comprador: ObjectId ref usuarios`, `pedido: ObjectId ref pedidos`, `calificacion: Number (1-5)`, `comentario: String`, `fechaCreacion: Date`. Pre-hook para `.populate()` de vendedor/comprador. `loadClass(Resena)` |
| `packages/backend/schemas/usuarioSchema.js` | **MODIFICAR**: Agregar campos rating | `promedioCalificacion: { type: Number, default: 0, min: 0, max: 5 }`, `cantidadResenas: { type: Number, default: 0 }` |

**Persistencia:** Los datos se guardan en MongoDB, base de datos especificada en `process.env.URI_DB` (ver `database/database.js`). Mongoose ODM convierte objetos JavaScript a documentos BSON.

#### **3. VALIDATORS** (Zod - Validación de esquemas)

| Archivo | Descripción | Contenido |
|---------|-------------|-----------|
| `packages/backend/validators/validators.js` | **AGREGAR**: Schemas Zod para validación | `export const resenaSchema = z.object({ vendedor: idTransform, comprador: idTransform, pedido: idTransform, calificacion: z.number().int().min(1).max(5), comentario: z.string().max(500).optional() })`. Uso: `resenaSchema.safeParse(req.body)` en controller |

#### **4. REPOSITORIES** (Acceso a datos)

| Archivo | Descripción | Contenido |
|---------|-------------|-----------|
| `packages/backend/repositories/resenaRepository.js` | CRUD de reseñas en MongoDB | `save(resena)` - crea documento, `findByVendedor(vendedorId, page, limit)` - paginación, `findByPedido(pedidoId)` - verifica duplicados, `countByVendedor(vendedorId)` - total reseñas. **Retorna Promises** |
| `packages/backend/repositories/usuarioRepository.js` | **MODIFICAR**: Método para actualizar rating | `updateRating(vendedorId, promedioCalificacion, cantidadResenas)` - actualiza campos con `findByIdAndUpdate()` |

#### **5. SERVICES** (Lógica de negocio - **Uso intensivo de Promises**)

| Archivo | Descripción | Contenido y Promises |
|---------|-------------|---------------------|
| `packages/backend/services/resenaService.js` | Orquesta creación de reseñas y actualización de ratings | **Constructor:** `constructor(resenaRepository, usuarioService, pedidoService)`<br><br>**`create(resenaData)` Promise chain:**<br>1. `pedidoService.find(resenaData.pedido).then()` - valida pedido existe<br>2. Verifica `pedido.estado === 'Entregado'` - throw error si no<br>3. Verifica `pedido.comprador === resenaData.comprador` - autorización<br>4. `resenaRepository.findByPedido(pedidoId).then()` - evita duplicados<br>5. `resenaRepository.save(resena).then()` - guarda reseña<br>6. `calcularNuevoPromedio(vendedorId).then()` - recalcula rating<br>7. `usuarioService.updateRating()` - actualiza vendedor<br><br>**`findByVendedor(vendedorId, page, limit)`** - Promise que retorna lista paginada<br><br>**`calcularNuevoPromedio(vendedorId)` Promise:**<br>- Aggregate pipeline en MongoDB para calcular AVG de calificaciones |
| `packages/backend/services/usuarioService.js` | **MODIFICAR**: Agregar método | `updateRating(vendedorId, promedio, cantidad)` - delega a repository. **Retorna Promise** |

#### **6. CONTROLLERS** (Manejo de HTTP Request/Response)

| Archivo | Descripción | Contenido |
|---------|-------------|-----------|
| `packages/backend/controllers/resenaController.js` | Controlador REST para reseñas | **Constructor:** `constructor(resenaService)`<br><br>**`create(req, res):`**<br>- Valida `req.body` con Zod: `resenaSchema.safeParse()`<br>- Extrae comprador de JWT: `req.user.id`<br>- **Retorna Promise:** `this.service.create(parsed.data)`<br><br>**`findByVendedor(req, res):`**<br>- Valida `req.params.vendedorId` con Zod<br>- Extrae paginación: `req.query.page`, `req.query.limit`<br>- **Retorna Promise:** `this.service.findByVendedor(vendedorId, page, limit)` |

#### **7. ERRORS** (Manejo de errores custom)

| Archivo | Descripción | Contenido |
|---------|-------------|-----------|
| `packages/backend/errors/resenasErrors/ResenaBadRequest.js` | Error 400 para datos inválidos | `class ResenaBadRequest extends Error` con mensaje de validación Zod |
| `packages/backend/errors/resenasErrors/ResenaYaExiste.js` | Error 409 para reseña duplicada | `class ResenaYaExiste extends Error` - "Ya existe una reseña para este pedido" |
| `packages/backend/errors/resenasErrors/PedidoNoEntregado.js` | Error 400 para pedidos no entregados | `class PedidoNoEntregado extends Error` - "Solo se pueden reseñar pedidos entregados" |
| `packages/backend/handlers/ResenaHandler.js` | Middleware de errores | Mapea errores a códigos HTTP: 400, 404, 409, 500 |

#### **8. ROUTERS** (Definición de rutas REST - **Convierte Promises a HTTP**)

| Archivo | Descripción | Contenido y Endpoints |
|---------|-------------|---------------------|
| `packages/backend/routers/resenaRouter.js` | Router Express para reseñas | **Función factory:** `function resenaRouter(getController)`<br><br>**POST** `/resenas` - Crear reseña:<br>```javascript<br>router.post(ENDPOINTS.RESENAS, authMiddleware, (req, res, next) => {<br>  getController(ResenaController).create(req, res)<br>    .then(resena => res.status(201).json(resena))<br>    .catch(error => next(error))<br>})<br>```<br><br>**GET** `/resenas/vendedor/:vendedorId` - Listar reseñas:<br>```javascript<br>router.get(COMPOSED_ROUTES.RESENA_BY_VENDEDOR, (req, res, next) => {<br>  getController(ResenaController).findByVendedor(req, res)<br>    .then(data => res.status(200).json(data))<br>    .catch(error => next(error))<br>})<br>```<br><br>**Error handler:** `router.use(resenaErrorHandler)` |
| `packages/backend/routers/routers.js` | **MODIFICAR**: Registrar router | Importar `resenaRouter`, agregar a array: `const routers = [..., resenaRouter]` |

#### **9. CONSTANTS** (Definición centralizada de endpoints)

| Archivo | Descripción | Contenido |
|---------|-------------|-----------|
| `packages/backend/constants/endpoints.js` | **MODIFICAR**: Agregar endpoints | `ENDPOINTS.RESENAS: "/resenas"`<br>`SUB_ROUTES.BY_VENDEDOR_ID: "/vendedor/:vendedorId"`<br>`COMPOSED_ROUTES.RESENA_BY_VENDEDOR: ENDPOINTS.RESENAS + SUB_ROUTES.BY_VENDEDOR_ID` |

#### **10. CONFIGURACIÓN** (Registro de dependencias)

| Archivo | Descripción | Contenido |
|---------|-------------|-----------|
| `packages/backend/index.js` | **MODIFICAR**: Inyección de dependencias | Después de línea 51:<br>```javascript<br>const repoResenas = new ResenaRepository()<br>const resenaService = new ResenaService(repoResenas, usuarioService, pedidoService)<br>const resenaController = new ResenaController(resenaService)<br>server.setController(ResenaController, resenaController)<br>``` |

---

### **FRONTEND**

#### **1. SERVICES** (HTTP Client con Axios - **Uso de Promises**)

| Archivo | Descripción | Contenido REST + Promises |
|---------|-------------|---------------------------|
| `packages/frontend/src/service/resenaService.js` | Cliente HTTP para API de reseñas | **Base URL:** `const API_BASE_URL = process.env.REACT_APP_API_URL \|\| 'http://localhost:3000'`<br><br>**`crearResena(resenaData)` - POST Promise:**<br>```javascript<br>export const crearResena = async (resenaData) => {<br>  const token = localStorage.getItem('token')<br>  const response = await axios.post(<br>    `${API_BASE_URL}/resenas`,<br>    resenaData,<br>    { headers: { 'Authorization': `Bearer ${token}` } }<br>  )<br>  return response.data // Promise resolved<br>}<br>```<br><br>**`obtenerResenasPorVendedor(vendedorId, page=1, limit=10)` - GET Promise:**<br>```javascript<br>export const obtenerResenasPorVendedor = async (vendedorId, page, limit) => {<br>  const response = await axios.get(<br>    `${API_BASE_URL}/resenas/vendedor/${vendedorId}?page=${page}&limit=${limit}`<br>  )<br>  return response.data // { resenas: [...], total: N }<br>}<br>``` |

**Protocolo:** HTTP/HTTPS usando REST (GET para lectura, POST para creación). Axios maneja Promises automáticamente con async/await.

#### **2. COMPONENTS** (Componentes reutilizables - **useState para estado local**)

| Archivo | Descripción | Estado y Props |
|---------|-------------|----------------|
| `packages/frontend/src/components/resenas/StarRating.jsx` | Componente para mostrar/seleccionar estrellas | **Props:** `value` (número 1-5), `onChange` (callback), `readOnly` (boolean)<br><br>**useState:**<br>- `const [hover, setHover] = useState(0)` - para efecto hover<br><br>Renderiza 5 estrellas (★/☆), en modo interactivo llama `onChange(rating)` al hacer click |
| `packages/frontend/src/components/resenas/ResenaCard.jsx` | Card para mostrar una reseña individual | **Props:** `resena` (objeto con: `comprador.nombre`, `calificacion`, `comentario`, `fechaCreacion`)<br><br>Muestra: nombre comprador, `<StarRating value={resena.calificacion} readOnly />`, comentario, fecha formateada |
| `packages/frontend/src/components/resenas/ResenaForm.jsx` | Modal/formulario para crear reseña | **Props:** `pedido` (objeto), `onClose`, `onSubmit`<br><br>**useState:**<br>- `const [calificacion, setCalificacion] = useState(0)`<br>- `const [comentario, setComentario] = useState('')`<br>- `const [loading, setLoading] = useState(false)`<br><br>**handleSubmit Promise:**<br>```javascript<br>const handleSubmit = async (e) => {<br>  e.preventDefault()<br>  setLoading(true)<br>  await onSubmit({ calificacion, comentario, pedidoId: pedido._id })<br>  setLoading(false)<br>}<br>```<br><br>Renderiza: `<StarRating onChange={setCalificacion} />`, textarea, botones |

#### **3. FEATURES** (Páginas - **useEffect para carga de datos**)

| Archivo | Descripción | Hooks y Lógica |
|---------|-------------|----------------|
| `packages/frontend/src/features/perfil/PerfilComprador.jsx` | **MODIFICAR**: Agregar funcionalidad de reseñas | **useState nuevos:**<br>- `const [modalResenaOpen, setModalResenaOpen] = useState(false)`<br>- `const [pedidoAResenar, setPedidoAResenar] = useState(null)`<br><br>**useEffect existente:** Ya carga pedidos con `obtenerPedidosPorUsuario(user._id)` (Promise)<br><br>**Nueva función con Promise:**<br>```javascript<br>const handleCrearResena = async (resenaData) => {<br>  try {<br>    await crearResena({<br>      vendedor: pedidoAResenar.vendedor._id,<br>      comprador: user._id,<br>      pedido: pedidoAResenar._id,<br>      ...resenaData<br>    })<br>    toast.success('Reseña enviada')<br>    setModalResenaOpen(false)<br>    cargarPedidos() // refrescar lista<br>  } catch (error) {<br>    toast.error('Error al crear reseña')<br>  }<br>}<br>```<br><br>**Modificación en render:**<br>- Agregar botón "Dejar Reseña" en pedidos con `estado === 'Entregado'`<br>- Renderizar `<ResenaForm pedido={pedidoAResenar} onSubmit={handleCrearResena} onClose={...} />` |
| `packages/frontend/src/components/perfilVendedor/PerfilVendedor.jsx` | **MODIFICAR**: Mostrar rating y reseñas | **useState nuevos:**<br>- `const [resenas, setResenas] = useState([])`<br>- `const [paginaResenas, setPaginaResenas] = useState(1)`<br>- `const [totalResenas, setTotalResenas] = useState(0)`<br><br>**useEffect para cargar reseñas (Promise):**<br>```javascript<br>useEffect(() => {<br>  if (vendedor && vendedor._id) {<br>    obtenerResenasPorVendedor(vendedor._id, paginaResenas, 5)<br>      .then(data => {<br>        setResenas(data.resenas)<br>        setTotalResenas(data.total)<br>      })<br>      .catch(err => toast.error('Error al cargar reseñas'))<br>  }<br>}, [vendedor, paginaResenas])<br>```<br><br>**Modificación en render:**<br>- Header: mostrar `vendedor.promedioCalificacion` con `<StarRating readOnly />` y `({vendedor.cantidadResenas} reseñas)`<br>- Nueva sección de reseñas: mapear `resenas.map(r => <ResenaCard resena={r} />)`<br>- Paginación: botones que modifican `setPaginaResenas()` |

---

## 🔄 FLUJO COMPLETO DETALLADO

### **BACKEND: Crear Reseña (POST /resenas)**

```
1. HTTP Request llega → packages/backend/routers/resenaRouter.js
2. authMiddleware verifica JWT → extrae userId a req.user
3. Router llama → ResenaController.create(req, res)
4. Controller valida req.body con Zod (validators.js - resenaSchema)
5. Controller retorna Promise → ResenaService.create(data)
6. Service ejecuta cadena de Promises:
   a. pedidoService.find() → verifica pedido existe
   b. Valida pedido.estado === 'Entregado'
   c. resenaRepository.findByPedido() → verifica no duplicado
   d. resenaRepository.save() → guarda en MongoDB colección "resenas"
   e. calcularNuevoPromedio() → aggregate query en MongoDB
   f. usuarioService.updateRating() → actualiza vendedor en colección "usuarios"
7. Service resuelve Promise con reseña creada
8. Controller recibe Promise resolved
9. Router en .then() envía → res.status(201).json(resena)
10. Cliente recibe JSON response
```

### **BACKEND: Listar Reseñas (GET /resenas/vendedor/:vendedorId)**

```
1. HTTP Request → resenaRouter.js
2. Router llama → ResenaController.findByVendedor(req, res)
3. Controller valida vendedorId con Zod
4. Controller extrae query params: page, limit
5. Controller retorna Promise → ResenaService.findByVendedor(id, page, limit)
6. Service llama Repository Promise:
   a. resenaRepository.findByVendedor() → MongoDB find() + skip/limit
   b. Mongoose popula referencias (comprador, vendedor)
   c. resenaRepository.countByVendedor() → total count
7. Service resuelve Promise con { resenas: [...], total: N }
8. Router en .then() → res.status(200).json(data)
9. Cliente recibe array paginado
```

### **FRONTEND: Crear Reseña**

```
1. Usuario en PerfilComprador.jsx ve pedido "Entregado"
2. Click botón "Dejar Reseña" → setPedidoAResenar(pedido), setModalResenaOpen(true)
3. Modal ResenaForm.jsx se renderiza
4. Usuario selecciona estrellas → StarRating onChange={setCalificacion}
5. Usuario escribe comentario → textarea onChange actualiza useState(comentario)
6. Click "Enviar" → handleSubmit() en ResenaForm
7. ResenaForm llama → onSubmit({ calificacion, comentario }) (callback a PerfilComprador)
8. PerfilComprador ejecuta handleCrearResena() → Promise:
   a. Llama crearResena() de resenaService.js
   b. Axios POST a ${API_BASE_URL}/resenas con body + JWT header
   c. Backend procesa (flujo anterior)
   d. await response.data
9. .then() → toast.success(), setModalResenaOpen(false), cargarPedidos() (refrescar)
10. useEffect detecta cambio en pedidos → re-renderiza lista actualizada
```

### **FRONTEND: Mostrar Reseñas de Vendedor**

```
1. Usuario navega a PerfilVendedor.jsx
2. useEffect se ejecuta en mount (dependencia: [vendedor])
3. useEffect llama Promise → obtenerResenasPorVendedor(vendedor._id, 1, 5)
4. resenaService.js → Axios GET a /resenas/vendedor/{id}?page=1&limit=5
5. Backend retorna JSON { resenas: [...], total: 15 }
6. .then() actualiza useState:
   - setResenas(data.resenas)
   - setTotalResenas(data.total)
7. React re-renderiza:
   - Header muestra promedioCalificacion (3.5★) y cantidadResenas (15)
   - resenas.map() renderiza cada ResenaCard
   - Paginación muestra página 1/3
8. Usuario click "Página 2" → setPaginaResenas(2)
9. useEffect detecta cambio (dependencia: [paginaResenas])
10. Repite desde paso 3 con page=2
```

---

## 📝 ENDPOINTS DEFINITIVOS

### **Backend REST API**

| Método | Ruta | Archivo Router | Descripción | Request Body | Response |
|--------|------|----------------|-------------|--------------|----------|
| POST | `/resenas` | `resenaRouter.js` | Crear reseña (requiere JWT) | `{ vendedor: string, comprador: string, pedido: string, calificacion: number, comentario?: string }` | `201: { _id, vendedor, comprador, pedido, calificacion, comentario, fechaCreacion }` |
| GET | `/resenas/vendedor/:vendedorId?page=1&limit=10` | `resenaRouter.js` | Listar reseñas de vendedor (público) | N/A | `200: { resenas: [...], total: number }` |

**Definidos en:**
- `packages/backend/constants/endpoints.js`: constantes de rutas
- `packages/backend/routers/resenaRouter.js`: implementación con Express Router
- `packages/backend/routers/routers.js`: registro en array de routers

### **Frontend Axios Calls**

| Función | Archivo | Método HTTP | URL | Uso en Componente |
|---------|---------|-------------|-----|-------------------|
| `crearResena(data)` | `resenaService.js` | POST | `/resenas` | `PerfilComprador.jsx` - handleCrearResena() |
| `obtenerResenasPorVendedor(id, page, limit)` | `resenaService.js` | GET | `/resenas/vendedor/${id}?page=${page}&limit=${limit}` | `PerfilVendedor.jsx` - useEffect() |

---

## 🔧 VALIDACIONES Y SCHEMAS ZOD

### **Definidos en `packages/backend/validators/validators.js`**

```javascript
export const resenaSchema = z.object({
  vendedor: idTransform, // ObjectId de 24 chars hex
  comprador: idTransform,
  pedido: idTransform,
  calificacion: z.number()
    .int({ message: "Calificación debe ser entero" })
    .min(1, "Calificación mínima: 1")
    .max(5, "Calificación máxima: 5"),
  comentario: z.string()
    .max(500, "Comentario máximo: 500 caracteres")
    .optional()
})
```

**Uso en Controller:**
```javascript
const parsed = resenaSchema.safeParse(req.body)
if (!parsed.success) {
  throw new ResenaBadRequest(parsed.error.issues)
}
// parsed.data contiene datos validados y transformados
```

---

## 💾 PERSISTENCIA EN MONGODB

**Conexión:** `packages/backend/database/database.js` → `mongoose.connect(process.env.URI_DB)`

**Colecciones afectadas:**

1. **`resenas`** (nueva):
   - Documentos: `{ _id, vendedor: ObjectId, comprador: ObjectId, pedido: ObjectId, calificacion: Number, comentario: String, fechaCreacion: Date }`
   - Índices sugeridos: `vendedor` (queries por vendedor), `pedido` (verificar duplicados)

2. **`usuarios`** (modificada):
   - Campos nuevos: `promedioCalificacion: Number`, `cantidadResenas: Number`
   - Actualización: `UsuarioModel.findByIdAndUpdate()` en `updateRating()`

**Mongoose ODM:**
- `ResenaSchema` define estructura + validaciones
- `loadClass(Resena)` integra métodos de clase de dominio
- `pre('find')` hooks para auto-populate de referencias

---

## ⚡ USO DE PROMISES

### **Backend (Cadenas de Promises):**

1. **Repositories:** Todas las funciones retornan Promises (Mongoose queries son thenables)
2. **Services:** Encadenan Promises con `.then()/.catch()` o `async/await`
3. **Controllers:** Retornan Promises sin resolverlas
4. **Routers:** Resuelven Promises con `.then(data => res.json(data)).catch(next)`

**Ejemplo en ResenaService.create():**
```javascript
create(resenaData) {
  return this.pedidoService.find(resenaData.pedido) // Promise 1
    .then(pedido => {
      if (pedido.estado !== 'Entregado') throw new PedidoNoEntregado()
      return this.resenaRepository.findByPedido(pedido._id) // Promise 2
    })
    .then(existente => {
      if (existente) throw new ResenaYaExiste()
      return this.resenaRepository.save(resenaData) // Promise 3
    })
    .then(resenaNueva => {
      return this.calcularNuevoPromedio(resenaNueva.vendedor) // Promise 4
        .then(nuevoPromedio => ({ resenaNueva, nuevoPromedio }))
    })
    .then(({ resenaNueva, nuevoPromedio }) => {
      return this.usuarioService.updateRating(...) // Promise 5
        .then(() => resenaNueva)
    })
}
```

### **Frontend (Promises con Axios):**

1. **Services:** Funciones `async` que retornan Promises
2. **Componentes:** `useEffect` con async/await, o `.then()/.catch()`

**Ejemplo en PerfilComprador.jsx:**
```javascript
const handleCrearResena = async (resenaData) => {
  try {
    setLoading(true)
    const resena = await crearResena({...}) // await Promise
    toast.success('Reseña creada')
    await cargarPedidos() // await Promise para refrescar
  } catch (error) {
    toast.error(error.message)
  } finally {
    setLoading(false)
  }
}
```

---

## 🎯 REACT HOOKS

### **useState (Estado local del componente)**

| Componente | Estados | Propósito |
|------------|---------|-----------|
| `ResenaForm.jsx` | `[calificacion, setCalificacion]`<br>`[comentario, setComentario]`<br>`[loading, setLoading]` | Controlar inputs del formulario y estado de carga |
| `StarRating.jsx` | `[hover, setHover]` | Efecto visual hover en estrellas |
| `PerfilComprador.jsx` | `[modalResenaOpen, setModalResenaOpen]`<br>`[pedidoAResenar, setPedidoAResenar]` | Controlar apertura de modal y pedido seleccionado |
| `PerfilVendedor.jsx` | `[resenas, setResenas]`<br>`[paginaResenas, setPaginaResenas]`<br>`[totalResenas, setTotalResenas]` | Lista de reseñas, paginación, total de resultados |

### **useEffect (Efectos secundarios y carga de datos)**

| Componente | Dependencias | Acción |
|------------|--------------|--------|
| `PerfilComprador.jsx` | `[user]` | Ya existe: carga pedidos con `obtenerPedidosPorUsuario()` Promise |
| `PerfilVendedor.jsx` | `[vendedor, paginaResenas]` | **NUEVO:** Llama `obtenerResenasPorVendedor()` Promise al montar y cuando cambia paginación |

**Ejemplo useEffect con Promise:**
```javascript
useEffect(() => {
  if (vendedor?._id) {
    obtenerResenasPorVendedor(vendedor._id, paginaResenas, 5)
      .then(data => {
        setResenas(data.resenas)
        setTotalResenas(data.total)
      })
      .catch(err => toast.error('Error'))
  }
}, [vendedor, paginaResenas]) // Re-ejecuta al cambiar página
```
