# 1) Arquitectura General del Proyecto

## (A) Resumen Corto
Un proyecto full-stack MERN divide el código en dos aplicaciones principales: el frontend (React) y el backend (Node.js/Express).
Este proyecto canónico se estructura como un "monorepo", conteniendo ambas aplicaciones en carpetas separadas dentro de un solo repositorio, lo cual tiene implicaciones directas en el desarrollo y el despliegue.

## (B) Explicación Detallada
### Monorepo vs. Poli-repo:
* Un **monorepo** (como el proyecto de este caso) aloja múltiples sub-proyectos (como frontend y backend) en un único repositorio Git.
* Un **poli-repo** utiliza repositorios Git separados para cada servicio (ej. un repo para la API, otro para la UI de React).
* **Ventajas del Monorepo:** Facilita el desarrollo local, ya que todo el código está en un solo lugar.
* Si se comparte lógica (ej. tipos de TypeScript o esquemas de validación), se puede crear una tercera carpeta /shared.
* **Desventajas del Monorepo:** Requiere una configuración de despliegue más avanzada.
* Como se verá en la Sección 14, se debe instruir a Netlify para que despliegue solo la carpeta frontend y a Render para que despliegue solo la backend.

### Estructura de Carpetas Canónica (Monorepo): Esta estructura representa la "Separación de Responsabilidades" a nivel de sistema.

```text
/
├── backend/
│   ├── src/
│   │   ├── controllers/ (Ej. vendedor.controller.js)
│   │   ├── models/      (Ej. Vendedor.model.js)
│   │   ├── repositories/ (Ej. vendedor.repository.js)
│   │   ├── services/    (Ej. vendedor.service.js)
│   │   ├── routes/      (Ej. vendedor.routes.js)
│   │   ├── middlewares/ (Ej. errorHandler.js)
│   │   ├── database.js  (Conexión a MongoDB)
│   │   └── index.js     (Servidor Express 'app.listen')
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  (Presentacionales/Dumb, Ej. VendedorCard.jsx)
    │   ├── features/    (Contenedores/Smart, Ej. VendedoresPage.jsx)
    │   ├── services/    (Ej. api.js - Configuración de Axios)
    │   ├── routes/      (Ej. AppRouter.jsx - Rutas de React Router)
    │   ├── App.jsx
    │   └── main.jsx     (Punto de entrada de React)
    └── package.json
````

## (C) Ejemplos de Código (Rutas de Archivos)

  * `frontend/src/features/Vendedores/VendedoresPage.jsx`: Componente "inteligente" (smart) que maneja la lógica para buscar y mostrar vendedores.
  * `frontend/src/components/VendedorCard.jsx`: Componente "tonto" (dumb) que solo recibe un vendedor por props y lo muestra.
  * `backend/src/routes/vendedor.routes.js`: Define los endpoints de la API REST para el recurso "vendedor".
  * `backend/src/services/vendedor.service.js`: Contiene la lógica de negocio pura para las operaciones de vendedores.

## (D) Consejos para el Examen

  * La estructura de carpetas del backend (models, routes, controllers, services, repositories) no es aleatoria.
  * Es la implementación física de la "Arquitectura de Capas" (ver Sección 4). Cada carpeta tiene una responsabilidad única.
  * La elección de "monorepo" impacta directamente en la configuración de CI/CD (Despliegue Continuo), ya que se deben especificar directorios base diferentes para el frontend y el backend en los servicios de hosting (ver Sección 14).

## (E) Preguntas Tipo Examen

**P: ¿Cuál es la principal desventaja de un monorepo al momento de desplegar en servicios como Netlify y Render?**
R: La complejidad de la configuración. Se debe indicar a cada servicio de hosting un "Directorio Base" o "Directorio Raíz" diferente (frontend o backend) para que sepan qué código construir y desplegar.

**P: ¿Por qué separamos features (contenedores) de components (presentacionales) en la estructura de React?**
R: Para aplicar la "Separación de Responsabilidades". features maneja la lógica (estado, fetch de datos), mientras que components solo se encarga de la UI (recibe props, muestra JSX), haciéndolos más reutilizables.

-----

# 2\) Requerimientos Funcionales vs No Funcionales

## (A) Resumen Corto

  * Los Requerimientos Funcionales (F) describen **qué** debe hacer el sistema (ej. "el usuario debe poder crear un vendedor").
  * Los Requerimientos No Funcionales (NF) describen **cómo** debe hacerlo (ej. "el sistema debe responder en menos de 2 segundos y ser seguro").
  * En el código, los F se ven como **endpoints** y **componentes**, mientras que los NF se manifiestan como **middlewares** (CORS, errores), **configuraciones** (validación de esquemas) y la arquitectura misma.

## (B) Explicación Detallada

### Requerimientos Funcionales (F):

  * **Definición:** Son las características y acciones visibles para el usuario. Definen las capacidades específicas del software.
  * **Evidencia en código:** Se implementan como "casos de uso" (ver Sección 3) que viajan verticalmente a través de las capas.
  * Un RF "Crear Vendedor" se traduce en:
      * Un formulario en React (`frontend/src/features/Vendedores/VendedorForm.jsx`).
      * Un endpoint en la API (`POST /api/vendedores` en `backend/src/routes/vendedor.routes.js`).
      * Lógica de negocio (`backend/src/services/vendedor.service.js`).

### Requerimientos No Funcionales (NF):

  * **Definición:** Son las restricciones, cualidades y estándares de calidad del sistema.
  * No son una "función" sino una **propiedad** del sistema.
  * **Evidencia en código:** A menudo se implementan "horizontalmente" como **concerns transversales** (cross-cutting concerns), usualmente mediante **middlewares** en Express o reglas en los modelos.
  * **Ejemplos Concretos:**
      * **Seguridad (NF):** "La API solo debe aceptar peticiones desde el dominio del frontend."
      * **Evidencia:** `app.use(cors({ origin: process.env.CORS_ORIGIN }))` en `backend/src/index.js`.
      * **Robustez (NF):** "El servidor no debe detenerse si ocurre un error en la base de datos."
      * **Evidencia:** El middleware de manejo de errores de 4 argumentos en `backend/src/index.js` (ver Sección 5).
      * **Integridad de Datos (NF):** "No se deben guardar vendedores sin un nombre o con un email inválido."
      * **Evidencia:** El esquema de Mongoose (`nombre: { type: String, required: true }`) en `backend/src/models/Vendedor.model.js`.
      * **Mantenibilidad (NF):** "El código debe ser fácil de modificar y testear."
      * **Evidencia:** La propia adopción de la Arquitectura de Capas (ver Sección 4).
      * **Performance (NF):** "La lista de vendedores debe cargar rápido, incluso con 1 millón de registros."
      * **Evidencia:** Implementación de paginación en el endpoint `GET /api/vendedores` (usando `.limit()` y `.skip()` de Mongoose).

## (C) Tabla de Ejemplos

| Tipo | Descripción | Evidencia en Código (Ruta y Fragmento Canónico) |
| :--- | :--- | :--- |
| F | El usuario puede ver la lista de vendedores. | `backend/src/routes/vendedor.routes.js: router.get('/', VendedorController.getAll);` |
| F | El usuario puede crear un nuevo vendedor. | `frontend/src/features/Vendedores/VendedorForm.jsx: const handleSubmit = () => api.post('/vendedores', formData);` |
| NF | Seguridad: Prevenir ataques Cross-Site y limitar el acceso. | `backend/src/index.js: app.use(cors({ origin: process.env.CORS_ORIGIN }));` |
| NF | Integridad de Datos: El email de un vendedor debe tener un formato válido. | `backend/src/models/Vendedor.model.js: email: { type: String, match: /^\S+@\S+\.\S+$/ }` |
| NF | Robustez: El sistema debe manejar errores de forma centralizada. | `backend/src/index.js: app.use(errorHandlerMiddleware);` |

## (D) Consejos para el Examen

  * Los Requerimientos Funcionales (F) fluyen **verticalmente** a través de las capas (Feature -\> Controller -\> Service -\> Repo).
  * Los Requerimientos No Funcionales (NF) se implementan **horizontalmente** como **middlewares** (CORS, Auth, Errores) o como **reglas** (Validación de Esquema).
  * La arquitectura de capas es, en sí misma, una respuesta a los NF de Mantenibilidad y Testeabilidad.

## (E) Preguntas Tipo Examen

**P: ¿La validación de datos en un esquema de Mongoose (required: true) es un requerimiento Funcional o No Funcional?**
R: Es No Funcional (NF). Define una restricción (integridad de datos) sobre una operación funcional, pero no es la operación en sí misma.

**P: ¿Dónde se implementa típicamente un NF como la "autenticación" en una API de Express?**
R: Como un middleware que se aplica a las rutas que se desean proteger, antes de que la petición llegue al controller.

-----

# 3\) Casos de Uso (Lista)

## (A) Resumen Corto

  * Un caso de uso describe una interacción completa entre un actor (ej. "Usuario") y el sistema para lograr un objetivo (ej. "Crear un vendedor").
  * A continuación, se trazan los casos de uso principales de un CRUD (Create, Read, Update, Delete) de "Vendedores", conectando los componentes de React con los endpoints de la API y las capas del backend.

## (B) Lista Completa y Trazabilidad

  * **Actor:** "Usuario"
  * **Recurso:** "Vendedor"

| Caso de Uso (Objetivo) | Actor | Resumen | Componente Frontend (Canónico) | Endpoint Backend (Canónico) | Capas Backend Involucradas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1. Obtener Lista de Vendedores | Usuario | El usuario ve todas las tarjetas de vendedores. | `features/Vendedores/VendedoresPage.jsx` | `GET /api/vendedores` | "Controller, Service, Repository" |
| 2. Obtener Detalle de Vendedor | Usuario | El usuario hace clic en una tarjeta y ve los detalles. | `features/Vendedores/VendedorDetailPage.jsx` | `GET /api/vendedores/:id` | "Controller, Service, Repository" |
| 3. Crear Nuevo Vendedor | Usuario | El usuario llena un formulario y guarda un vendedor. | `features/Vendedores/VendedorForm.jsx` | `POST /api/vendedores` | "Controller, Service, Repository, Model (Validación)" |
| 4. Actualizar Vendedor | Usuario | El usuario edita un formulario existente y guarda. | `features/Vendedores/VendedorForm.jsx` (modo edición) | `PUT /api/vendedores/:id` | "Controller, Service, Repository, Model (Validación)" |
| 5. Eliminar Vendedor | Usuario | El usuario hace clic en un botón de "eliminar". | `components/VendedorCard.jsx` (botón) | `DELETE /api/vendedores/:id` | "Controller, Service, Repository" |

## (C) Trazabilidad Detallada del Caso de Uso 3: "Crear Nuevo Vendedor"

### Frontend (React):

  * El usuario navega a la ruta `/vendedores/nuevo`, que renderiza `VendedorForm.jsx`.
  * El usuario llena los campos (controlados por `useState`).
  * El usuario hace clic en `<button onClick={handleSubmit}>`.
  * La función `handleSubmit` llama a la instancia de Axios: `api.post('/vendedores', { nombre, email })` (ver Sección 10).

### Backend (Express):

  * La petición `POST /api/vendedores` llega a `backend/src/routes/vendedor.routes.js`.
  * Se ejecuta el `VendedorController.create` (ver Sección 4).
  * El Controller llama a `VendedorService.create(req.body)`.
  * El Service (tras lógica de negocio) llama a `VendedorRepository.create(data)`.
  * El Repository llama a `VendedorModel.create(data)`.

### Base de Datos (MongoDB):

  * Mongoose aplica las validaciones del Schema.
  * Si es válido, el documento se inserta en la colección `vendedores`.

### Respuesta:

  * La DB devuelve el nuevo documento al Repository.
  * El Repository lo devuelve al Service.
  * El Service lo devuelve al Controller.
  * El Controller responde al Frontend: `res.status(201).json(nuevoVendedor)`.

### Frontend (React):

  * La promesa de Axios se resuelve.
  * El frontend redirige al usuario (ej. a `/vendedores`) o muestra un mensaje de éxito.

## (D) Consejos para el Examen

  * Un "Caso de Uso" es la **traza vertical completa**.
  * Es la mejor forma de estudiar cómo se conectan todas las piezas del stack.
  * Para el examen, se debe ser capaz de elegir un caso de uso (como "Crear Vendedor") y describir cada archivo que "toca" desde el `onClick` en React hasta la inserción en MongoDB.

## (E) Preguntas Tipo Examen

**P: ¿Qué capa del backend es la primera en recibir una petición HTTP?**
R: La capa de Rutas (routes), que la delega al Controlador (controllers).

**P: ¿Qué componente de React es responsable de iniciar un caso de uso como "Crear Vendedor"?**
R: Un componente "Contenedor" o "Smart" (ej. `VendedorForm.jsx`), que maneja el estado del formulario y la llamada a la API.

-----

# 4\) Modelo de Capas (Services, Routes, Repository, etc.)

## (A) Resumen Corto

  * La Arquitectura de Capas organiza el backend en responsabilidades claras, promoviendo la "Separación de Responsabilidades".
  * Las peticiones fluyen desde las Rutas (HTTP) -\> Controladores (Orquestación) -\> Servicios (Lógica de Negocio) -\> Repositorios (Acceso a Datos). Esta separación hace que el código sea testeable, mantenible y flexible.

## (B) Explicación Detallada y Diagrama Conceptual

**Diagrama Conceptual (Flujo de Backend):**

```
Petición HTTP -> [Routes] -> [Controller] -> [Service] -> [Repository] -> [Model (Mongoose)] -> [MongoDB]
```

...y la respuesta (`res.json()`) fluye de vuelta en orden inverso.

### Responsabilidad de cada Capa (Backend Canónico):

  * **routes** (ej. `vendedor.routes.js`):
      * **Responsabilidad:** Definir los **endpoints** de la API y qué verbo HTTP (GET, POST) usan.
      * Conecta una URL a un método del Controlador.
      * **No debe:** Contener lógica de negocio.
  * **controllers** (ej. `vendedor.controller.js`):
      * **Responsabilidad:** Orquestación. Es el "control de tráfico" de HTTP. Lee `req.body`, `req.params`, `req.query`. Llama al Servicio apropiado.
      * Formatea la respuesta HTTP (`res.status(200).json(...)`) o delega errores (`next(err)`).
      * **No debe:** Hablar directamente con la base de datos (Mongoose). No debe contener lógica de negocio.
  * **services** (ej. `vendedor.service.js`):
      * **Responsabilidad:** El "cerebro" de la aplicación. Contiene la **lógica de negocio** pura.
      * Por ejemplo: "Al crear un vendedor, verificar si su email ya existe" o "Al crear una reseña, recalcular el rating promedio del vendedor".
      * **No debe:** Saber sobre `req` y `res`. No debe saber **cómo** se guardan los datos (ej. si es Mongoose o SQL).
      * Solo llama a métodos del repositorio (ej. `repository.create(data)`).
  * **repositories** (ej. `vendedor.repository.js`):
      * **Responsabilidad:** **Patrón Repositorio**. Es la capa de abstracción de acceso a datos.
      * Es el **único** lugar que sabe sobre Mongoose.
      * Traduce las peticiones del Servicio (ej. `findById`) en consultas de Mongoose (ej. `VendedorModel.findById(...)`).
      * **Beneficio**: Permite **mockear** (simular) la base de datos para **unit testing** del Servicio.
      * Permite cambiar de MongoDB a PostgreSQL sin tocar la capa de Servicio.
  * **models** (ej. `Vendedor.model.js`):
      * **Responsabilidad:** Definir el **esquema** de datos y las reglas de **validación**. Es el contrato con la base de datos.

### Frontend (Flujo de Inicialización):

  * `index.html` carga `main.jsx`.
  * `main.jsx` renderiza `<BrowserRouter>` (habilita el routing) y `<App />`.
  * `App.jsx` renderiza los componentes de layout (NavBar, Footer) y el componente `<Routes>`, que contiene todas las `<Route path="..." element={...} />`.
  * El router "monta" el componente que coincide con la URL actual (ej. `VendedoresPage.jsx` para la ruta `/vendedores`).

## (C) Ejemplos de Código (Comunicación entre Capas)

### Controller llamando a Service:

```javascript
// backend/src/controllers/vendedor.controller.js
import * as vendedorService from '../services/vendedor.service.js';

export const createVendedor = async (req, res, next) => {
  try {
    // 1. Orquesta: Pasa datos del req al service
    const nuevoVendedor = await vendedorService.create(req.body);
    // 2. Responde: Devuelve JSON con el código correcto 
    res.status(201).json(nuevoVendedor);
  } catch (error) {
    // 3. Delega errores 
    next(error);
  }
};
```

### Service llamando a Repository:

```javascript
// backend/src/services/vendedor.service.js
import * as vendedorRepository from '../repositories/vendedor.repository.js';

export const create = async (vendedorData) => {
  // 1. Lógica de Negocio (ej. validación compleja)
  const yaExiste = await vendedorRepository.findByEmail(vendedorData.email);
  if (yaExiste) {
    throw new Error('Email ya registrado');
    // Este error lo captura el controller
  }
  // 2. Llama al repositorio (NO a Mongoose)
  return await vendedorRepository.create(vendedorData);
};
```

### Repository llamando al Model (Mongoose):

```javascript
// backend/src/repositories/vendedor.repository.js
import VendedorModel from '../models/Vendedor.model.js';

// 1. Implementación del Patrón Repositorio
export const create = async (vendedorData) => {
  // 2. ÚNICO lugar que importa y usa el Modelo Mongoose
  return await VendedorModel.create(vendedorData);
};

export const findByEmail = async (email) => {
    return await VendedorModel.findOne({ email });
};
```

## (D) Consejos para el Examen

  * La separación entre Service y Repository es crucial.
  * **Controller:** ¿HTTP? Sí. ¿Lógica de Negocio? No. ¿Mongoose? No.
  * **Service:** ¿HTTP? No. ¿Lógica de Negocio? Sí. ¿Mongoose? No.
  * **Repository:** ¿HTTP? No. ¿Lógica de Negocio? No. ¿Mongoose? Sí.
  * Esta arquitectura sigue el principio de **Inversión de Dependencias**: El Servicio **depende** de la **abstracción** (el repositorio), no del **detalle** (Mongoose).

## (E) Preguntas Tipo Examen

**P: ¿En qué capa se valida si un usuario tiene permisos para crear un vendedor?**
R: En la capa de Servicio (`vendedor.service.js`), ya que es una regla de Lógica de Negocio. (Aunque la autenticación inicial se hace en un middleware).

**P: ¿Por qué el Controlador no debe llamar a `VendedorModel.create()` directamente?**
R: Porque viola la Separación de Responsabilidades. Mezcla la lógica de orquestación HTTP (Controller) con la lógica de acceso a datos (Model). Esto hace el código difícil de testear y mantener.

**P: ¿Cuál es el beneficio de la capa Repositorio?**
R: Abstrae la base de datos. Permite probar la lógica de negocio (Servicios) sin una base de datos real (usando mocks) y permite cambiar de MongoDB a otra DB sin reescribir los Servicios.

-----

# 5\) Manejo de Errores y Handler

## (A) Resumen Corto

  * Un patrón de manejo de errores robusto utiliza `try...catch` en funciones `async` (Controladores) para capturar errores. Los errores capturados se pasan a `next(err)`.
  * Express redirige la petición a un **middleware de manejo de errores** especial (con 4 argumentos) que centraliza todos los errores y envía una respuesta HTTP 500 (o 4xx).

## (B) Explicación Detallada

  * **El Problema:** En Node.js asíncrono, si un error ocurre (ej. la DB se desconecta) y no se captura, el servidor puede fallar o la petición puede quedar "colgando".
  * **La Solución (Patrón de 3 Pasos):**
    1.  **Captura en el Controlador:** Dado que los controladores son `async`, se usa `try...catch`.
    2.  **Delegación con `next()`:** En el bloque `catch`, **nunca** se usa `res.send()`.
    3.  Siempre se pasa el error a Express usando `next(error)`.
    4.  **Middleware Centralizado:** En `index.js`, **al final** de todas las rutas y middlewares, se define el "manejador".

### Flujo de un Error (Paso a Paso):

1.  Un error ocurre en una capa profunda, ej. el `vendedor.service.js` lanza un `throw new Error('Vendedor no encontrado')`.
2.  Como el Servicio fue llamado con `await` en el Controlador, el `try...catch` del Controlador captura este error.

<!-- end list -->

```javascript
// backend/src/controllers/vendedor.controller.js
export const getVendedorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vendedor = await vendedorService.getById(id); // Supongamos que esto falla
    if (!vendedor) throw new Error('No encontrado');
    res.status(200).json(vendedor);
  } catch (error) {
    // ¡CLAVE! El error se pasa a next()
    next(error); 
  }
};
```

3.  Express recibe el `next(error)` y **omite** todos los middlewares y rutas siguientes.
4.  Busca el primer middleware que tenga **4 argumentos**: `(err, req, res, next)`.

## (C) Ejemplos de Código (El Handler)

```javascript
// backend/src/middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  // : Middleware de 4 argumentos
  console.error(err.stack); 
  // Loggear el error para el desarrollador

  // Determinar el código de estado
  // (Podríamos tener errores custom: if (err.name === 'ValidationError') status = 400)
  const statusCode = err.statusCode || 500; // 500 por defecto

  // Enviar respuesta JSON al cliente
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
};

// backend/src/index.js
import { errorHandler } from './middlewares/errorHandler.js';

//... (importar rutas, cors, etc.)

app.use('/api', allRoutes);

// ¡CLAVE! El handler de errores se define DESPUÉS de todas las rutas
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## (D) Consejos para el Examen

  * La diferencia entre `next()` y `next(err)`:
      * `next()`: Pasa a la **siguiente** ruta o middleware en la cadena.
      * `next(err)`: Pasa **directamente** al **manejador de errores** (el de 4 argumentos).
  * **async/await y Errores:** `async/await` permite usar `try/catch`. Sin él, se tendría que usar `.catch(err => next(err))` en cada promesa, lo cual es más verboso.
  * Existen paquetes como `express-async-errors` que automatizan el `try/catch/next`, pero es fundamental entender el patrón manual para el examen.

## (E) Preguntas Tipo Examen

**P: ¿Por qué un middleware de manejo de errores de Express tiene 4 argumentos (err, req, res, next) y no 3?**
R: La presencia del primer argumento `err` es cómo Express lo identifica específicamente como un manejador de errores, distinguiéndolo de un middleware regular (`req`, `res`, `next`).

**P: ¿Qué pasa si ocurre un error en una función `async` de un controlador y no se usa `try/catch` ni se pasa a `next(err)`?**
R: La petición se "colgará". El cliente recibirá un timeout porque la respuesta (`res.json`) nunca se envió y el manejador de errores nunca se invocó.

**P: ¿En qué parte del archivo `index.js` debe definirse el manejador de errores?**
R: Al final, después de que todas las rutas hayan sido definidas.

-----

# 6\) Request/Response, Prácticas HTTP y REST

## (A) Resumen Corto

  * REST (Representational State Transfer) es un estilo arquitectónico para diseñar APIs. Se basa en usar **Recursos** (sustantivos como `/vendedores`), **Verbos HTTP** (GET, POST, PUT, DELETE) para acciones, y ser **Stateless** (sin estado). Una API RESTful bien diseñada es predecible y fácil de consumir.

## (B) Explicación Detallada

### Principios REST Aplicados:

  * **Arquitectura Cliente-Servidor:** El frontend (React) y el backend (Express) están totalmente separados. Se comunican solo por HTTP.
  * **Stateless (Sin Estado):** El servidor **no** guarda el estado del cliente (ej. en `req.session`).
  * Cada petición del cliente (ej. Axios) debe contener toda la información necesaria para ser entendida (ej. si requiere autenticación, debe enviar un **token** JWT en cada cabecera `Authorization`).
  * **Interfaz Uniforme:**
      * **Recursos (Sustantivos, no verbos):** Se usa `/api/vendedores`, NO `/api/crearVendedor`.
      * **Verbos HTTP:** Se usa el método HTTP para definir la acción.
          * `GET`: Leer (Idempotente: llamarlo N veces da el mismo resultado).
          * `POST`: Crear (No Idempotente: llamarlo N veces crea N recursos).
          * `PUT`: Actualizar/Reemplazar (Idempotente).
          * `DELETE`: Eliminar (Idempotente).
      * **Representaciones:** Los datos se intercambian en un formato estándar (JSON).

## (C) Ejemplos de 4 Endpoints Representativos

| Método | Ruta (Endpoint) | Descripción | Request Body (Ejemplo) | Response Éxito (2xx) | Response Error (4xx/5xx) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/vendedores` | Obtener todos los vendedores. | (N/A) | **Código 200 (OK)** <br> `[ { "id": "1", "nombre": "Ana" }, ... ]` | **Código 500 (Server Error)** <br> `{ "message": "Error en la DB" }` |
| **GET** | `/api/vendedores/:id` | Obtener un vendedor por ID. | (N/A) | **Código 200 (OK)** <br> `{ "id": "1", "nombre": "Ana", ... }` | **Código 404 (Not Found)** <br> `{ "message": "Vendedor no encontrado" }` |
| **POST** | `/api/vendedores` | Crear un nuevo vendedor. | `{ "nombre": "Carlos", ... }` | **Código 201 (Created)** <br> `{ "id": "3", "nombre": "Carlos", ... }` | **Código 400 (Bad Request)** <br> `{ "message": "El nombre es obligatorio" }` |
| **PUT** | `/api/vendedores/:id` | Actualizar un vendedor existente. | `{ "nombre": "Carlos Silva", ... }` | **Código 200 (OK)** <br> `{ "id": "3", "nombre": "Carlos Silva", ... }` | **Código 404 (Not Found)** <br> `{ "message": "Vendedor no encontrado" }` |

## (D) Consejos para el Examen

  * **Idempotencia:** Entender este concepto es clave. GET, PUT y DELETE **deben** ser idempotentes.
  * **POST** **no** lo es.
  * **Códigos de Estado:** Es fundamental conocer los básicos:
      * `200 OK`: Éxito genérico (usado para GET y PUT).
      * `201 Created`: Éxito al crear (POST).
      * `204 No Content`: Éxito, pero no hay nada que devolver (usado a veces para DELETE).
      * `400 Bad Request`: Error del cliente (ej. validación fallida, falta un campo).
      * `401 Unauthorized`: No autenticado (falta token).
      * `403 Forbidden`: Autenticado, pero sin permisos.
      * `404 Not Found`: Recurso no encontrado (ej. `GET /vendedores/id-inexistente`).
      * `500 Internal Server Error`: Error del servidor (ej. la DB falló).
  * **Nombres de Rutas:** Siempre usar sustantivos en plural para las colecciones (ej. `/vendedores`, no `/vendedor`).

## (E) Preguntas Tipo Examen

**P: ¿Por qué `POST /api/vendedores` no es idempotente?**
R: Porque si se ejecuta la misma petición POST dos veces, creará dos vendedores diferentes (con IDs diferentes).

**P: ¿Cuál es la diferencia entre un código 401 y 403?**
R: `401 Unauthorized` significa que el cliente no está autenticado (no proveyó un token o es inválido). `403 Forbidden` significa que está autenticado, pero su usuario (ej. rol "invitado") no tiene permiso para acceder a ese recurso (ej. un panel de "admin").

**P: ¿Es `DELETE /api/vendedores/123` idempotente?**
R: Sí. La primera vez borra el recurso y devuelve 200. La segunda vez (y N veces más) el recurso ya no existe, devuelve 404, pero el estado del sistema sigue siendo el mismo (el recurso 123 no existe).

-----

# 7\) Uso de Promises (por qué, cuándo usar, ejemplos)

## (A) Resumen Corto

  * JavaScript es asíncrono. Las Promesas son objetos que representan el resultado (éxito o fallo) de una operación asíncrona (ej. una llamada a la DB).
  * Se utiliza la sintaxis `async/await` porque es "azúcar sintáctica" sobre las Promesas que permite escribir código asíncrono que **parece** síncrono, mejorando la legibilidad y permitiendo el uso de `try/catch` para errores.

## (B) Explicación Detallada

### ¿Por qué existen las Promesas?

  * En Node.js, las operaciones de I/O (Input/Output), como leer un archivo o consultar una base de datos, son **asíncronas**.
  * No bloquean el hilo principal.
  * Antiguamente se usaban **callbacks** (el "callback hell").
  * Una Promesa es un objeto con 3 estados: `pending` (pendiente), `fulfilled` (cumplida/éxito), o `rejected` (rechazada/fallo).

### Forma Antigua: `.then()` y `.catch()`

  * Esto es lo que `async/await` hace internamente.

<!-- end list -->

```javascript
// backend/src/controllers/vendedor.controller.js (Estilo Antiguo)
export const createVendedor = (req, res, next) => {
  vendedorService.create(req.body)
   .then(nuevoVendedor => {
      res.status(201).json(nuevoVendedor);
    })
   .catch(error => {
      next(error); // Difícil de manejar múltiples promesas
    });
};
```

### Forma Moderna: `async/await`

  * `async`: Palabra clave que se pone antes de una función. Hace dos cosas:
    1.  Hace que la función **automáticamente devuelva una promesa**.
    2.  Permite usar la palabra clave `await` **dentro** de ella.
  * `await`: Palabra clave que **solo** funciona dentro de una función `async`.
      * Se pone delante de una función que devuelve una promesa (ej. `await vendedorService.create(...)`).
      * **Pausa la ejecución** de la función `async` hasta que la promesa se resuelva (sea `fulfilled` o `rejected`).
      * Si se cumple (`fulfilled`), "desenvuelve" el valor y lo asigna.
      * Si se rechaza (`rejected`), **lanza una excepción (throw)**.

### El Mismo Ejemplo con `async/await`:

```javascript
// backend/src/controllers/vendedor.controller.js (Estilo Moderno)
export const createVendedor = async (req, res, next) => {
  // : Permite usar try/catch para manejar errores de promesas
  try {
    // 1. await "pausa" la función aquí
    const vendedor = await vendedorService.findByEmail(req.body.email);
    if (vendedor) throw new Error('Email ya existe');

    // 2. await "pausa" la función de nuevo
    const nuevoVendedor = await vendedorService.create(req.body);
    res.status(201).json(nuevoVendedor);

  } catch (error) {
    // 3. Un solo catch maneja *ambos* 'await' y el 'throw'
    next(error);
  }
};
```

## (D) Consejos para el Examen

  * `async/await` es superior a `.then/.catch` no solo por legibilidad.
  * Su verdadero poder es que permite a `try/catch` manejar errores de operaciones asíncronas **como si fueran síncronas**.
  * Esto se integra **perfectamente** con el middleware de errores de Express (Sección 5), ya que se puede poner `next(error)` en un solo bloque `catch`.
  * **Anti-Patrón:** Mezclar `async/await` con `.then`. Si se usa `await`, no se necesita `.then`.
  * **Anti-Patrón:** Olvidar `await` (ej. `const user = service.findUser(id);`). Esto es un error común; `user` no contendrá el usuario, contendrá la **Promesa** (pending).

## (E) Preguntas Tipo Examen

**P: ¿Qué devuelve siempre una función declarada con `async`?**
R: Una Promesa.

**P: ¿Qué hace la palabra clave `await`?**
R: Pausa la ejecución de la función `async` hasta que la promesa se resuelva (o rechace), y luego devuelve el valor resuelto (o lanza el error).

**P: ¿Por qué `async/await` facilita el manejo de errores?**
R: Porque permite usar bloques `try/catch` estándar de JavaScript para capturar errores de promesas (operaciones asíncronas), lo que centraliza el manejo de errores, especialmente cuando se encadenan múltiples operaciones `await`.

-----

# 8\) Conexión a MongoDB — Recorrido por Capas

## (A) Resumen Corto

  * Esta sección traza una petición GET completa para obtener un vendedor por ID.
  * Se verá cómo la `req.params.id` viaja **hacia abajo** a través de las capas (Ruta -\> Controller -\> Service -\> Repository) y cómo el documento de Mongoose viaja **hacia arriba** como respuesta (DB -\> Repository -\> Service -\> Controller -\> `res.json()`).

## (B) Explicación Detallada (Paso a Paso)

**Caso de Uso:** Obtener un vendedor por ID (`GET /api/vendedores/60d5ec49f76a5b3a8c8f8b1a`)

### Capa 1: routes (Definición)

  * El router de Express matchea la petición.
  * **Archivo:** `backend/src/routes/vendedor.routes.js`
  * **Código:** `router.get('/:id', VendedorController.getById);`
  * **Acción:** Express detecta el parámetro `:id` y llama a la función `getById` del Controlador.

### Capa 2: controllers (Orquestación HTTP)

  * **Archivo:** `backend/src/controllers/vendedor.controller.js`
  * **Código:**

<!-- end list -->

```javascript
export const getById = async (req, res, next) => {
  try {
    // 1. Lee el ID desde req.params
    const { id } = req.params;
    // 2. Llama al Service
    const vendedor = await vendedorService.getById(id);
    // 3. Maneja el caso "No Encontrado"
    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor no encontrado' });
    }
    // 4. Envía la respuesta
    res.status(200).json(vendedor);
  } catch (error) {
    next(error);
  }
};
```

### Capa 3: services (Lógica de Negocio)

  * **Archivo:** `backend/src/services/vendedor.service.js`
  * **Código:**

<!-- end list -->

```javascript
export const getById = async (vendedorId) => {
  // 1. Pasa el ID al Repositorio
  // (Aquí podría haber lógica de negocio, ej. verificar permisos)
  const vendedor = await vendedorRepository.findById(vendedorId);
  // 2. Devuelve el resultado
  return vendedor;
};
```

  * **Observación:** Esta capa no sabe de `req` o `res`. Solo recibe `vendedorId`.

### Capa 4: repositories (Abstracción de Datos)

  * **Archivo:** `backend/src/repositories/vendedor.repository.js`
  * **Código:**

<!-- end list -->

```javascript
export const findById = async (id) => {
  // 1. Llama al Modelo Mongoose
  // Esta es la consulta real a Mongo 
  return await VendedorModel.findById(id);
};
```

  * **Observación:** Esta es la única capa (además del modelo) que importa `VendedorModel`.

### Capa 5: models (Esquema y Driver DB)

  * **Archivo:** `backend/src/models/Vendedor.model.js`
  * **Código:**

<!-- end list -->

```javascript
import mongoose from 'mongoose';

const vendedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

const VendedorModel = mongoose.model('Vendedor', vendedorSchema);
export default VendedorModel;
```

  * **Acción:** Mongoose (`.findById(id)`) traduce esta llamada a una consulta nativa de MongoDB (`db.vendedores.findOne({ _id: ObjectId(...) })`) y la ejecuta.

### El Viaje de Vuelta:

1.  MongoDB encuentra el documento.
2.  Mongoose lo devuelve al Repository.
3.  El Repository lo devuelve al Service.
4.  El Service lo devuelve al Controller.
5.  El Controller ejecuta `res.status(200).json(vendedor)`, enviando los datos al cliente.

## (C) Ejemplo de Consulta Mongoose

  * `await VendedorModel.findById(id);` (Usada arriba)
  * `await VendedorModel.findOne({ email: 'test@test.com' });` (Para buscar por email)
  * `await VendedorModel.create({ nombre: 'Nuevo', email: 'n@n.com' });` (Para crear)
  * `await VendedorModel.find({ categoria: 'ropa' }).limit(10);` (Para buscar con filtros)

## (D) Consejos para el Examen

  * Memorizar el flujo: **Route -\> Controller -\> Service -\> Repository -\> Model**.
  * Entender qué datos fluyen "hacia abajo" (el `id`) y qué fluyen "hacia arriba" (el `vendedor`).
  * Entender el rol de `req.params` (para `/vendedores/:id`), `req.query` (para `/vendedores?categoria=ropa`) y `req.body` (para `POST /vendedores`).

## (E) Preguntas Tipo Examen

**P: ¿En qué capa se extrae el ID de `req.params`?**
R: En el Controlador (controllers).

**P: ¿Qué capa es responsable de llamar a `VendedorModel.findById()`?**
R: El Repositorio (repositories).

**P: ¿Por qué el Servicio no recibe `req` y `res` como parámetros?**
R: Porque el Servicio debe ser agnóstico a HTTP. Debe contener solo lógica de negocio pura, para que pueda ser reutilizado y probado fácilmente, independientemente de si es llamado por un Controlador HTTP, un test, u otro servicio.

-----

# 9\) DOM, Callbacks y Eventos (Frontend)

## (A) Resumen Corto

  * React maneja el DOM usando un "DOM Virtual". En lugar de manipular el DOM directamente (ej. `document.getElementById`), se cambia el **estado** (`useState`). React detecta este cambio y actualiza eficientemente el DOM real.
  * Se manejan eventos (`onClick`, `onChange`) y se pasan datos **hacia arriba** (de hijo a padre) usando **props** que son funciones (callbacks).

## (B) Explicación Detallada

### Interacción con el DOM (El Modelo de React):

  * **No se utiliza:** `document.getElementById('mi-input').value = 'hola';`
  * **Se utiliza el Patrón de Componente Controlado:**
    1.  Se define un estado: `const [nombre, setNombre] = useState('');`.
    2.  Se maneja el evento `onChange`: `<input onChange={(e) => setNombre(e.target.value)}... />`.
    3.  Se vincula el estado al valor del input: `<input... value={nombre} />`.
  * **Flujo:** Evento (`onChange`) -\> Actualiza el Estado (`setNombre`) -\> React Re-renderiza -\> El DOM se actualiza (`value={nombre}`).

### Manejo de Eventos (handlers):

  * Se usan `onClick`, `onChange`, `onSubmit` en el JSX.
  * `onSubmit` en un `<form>` es preferible para la accesibilidad (permite usar "Enter").
  * Es importante llamar a `e.preventDefault()` para evitar que el navegador recargue la página.

### Flujo de Callbacks (Props -\> Callback):

  * En React, los datos fluyen **hacia abajo** (de Padre a Hijo) vía `props`.
  * Para enviar datos **hacia arriba** (de Hijo a Padre), el Padre le pasa una **función** (un callback) al Hijo como `prop`.
  * El Hijo **ejecuta** esa función cuando algo sucede.

## (C) Ejemplos de Código (Flujo Hijo -\> Padre)

### Padre (Contenedor): `VendedorFormPage.jsx`

  * Define la **función** que sabe cómo guardar en la API.
  * Pasa esa función como `prop` (`onSave`) al hijo.

<!-- end list -->

```javascript
// frontend/src/features/Vendedores/VendedorFormPage.jsx
import VendedorForm from '../../components/VendedorForm.jsx';
import api from '../../services/api.js'; 
// Asumiendo que api es la instancia de Axios
import { useNavigate } from 'react-router-dom';

function VendedorFormPage() {
  const navigate = useNavigate();

  // 1. Define el "handler" que tiene la lógica (llamar a la API)
  const handleSave = async (vendedorData) => {
    try {
      await api.post('/vendedores', vendedorData);
      navigate('/vendedores'); // Redirige al éxito
    } catch (error) {
      console.error('Error al guardar', error);
    }
  };

  // 2. Pasa el handler como "prop" al componente presentacional
  return (
    <div>
      <h1>Crear Vendedor</h1>
      <VendedorForm onSave={handleSave} />
    </div>
  );
}
```

### Hijo (Presentacional): `VendedorForm.jsx`

  * No sabe **qué** pasa al guardar, solo sabe que debe **llamar a la prop** `onSave`.

<!-- end list -->

```javascript
// frontend/src/components/VendedorForm.jsx
import { useState } from 'react';

// 1. Recibe 'onSave' como una prop
function VendedorForm({ onSave }) { 
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 3. Llama al "callback prop" con los datos del estado
    onSave({ nombre, email }); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={nombre} 
        onChange={(e) => setNombre(e.target.value)} 
        placeholder="Nombre" 
      />
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
      />
      <button type="submit">Guardar</button>
    </form>
  );
}
export default VendedorForm;
```

## (D) Consejos para el Examen

  * Este patrón (Padre define función, Hijo la recibe como prop y la llama) es **fundamental** en React.
  * Es la forma de mantener los componentes presentacionales "dumb" (tontos) y la lógica centralizada en los contenedores.
  * Recordar `e.preventDefault()` en los `onSubmit` de los formularios.

## (E) Preguntas Tipo Examen

**P: ¿Cómo se envían datos de un componente Hijo a un componente Padre?**
R: El Padre pasa una función (callback) al Hijo a través de las props. El Hijo ejecuta esa función (prop) y le pasa los datos como argumentos.

**P: ¿Qué es un "componente controlado" en un formulario de React?**
R: Es un input cuyo valor está "controlado" por el estado de React (`useState`). El valor del input se fija con la prop `value={estado}` y se actualiza con el evento `onChange={e => setEstado(e.target.value)}`.

-----

# 10\) Routing en Frontend y Uso de Axios

## (A) Resumen Corto

  * Se utiliza `react-router-dom v6` para manejar la navegación en la Single Page Application (SPA).
  * Axios es la librería utilizada para hacer peticiones HTTP (fetch) al backend.
  * Se configura una **instancia** de Axios para centralizar la `baseURL` y los **interceptors**.

## (B) Explicación Detallada

### Routing (`React Router v6`):

  * **Propósito:** Permite cambiar la URL del navegador y renderizar diferentes componentes de React **sin** recargar la página (SPA).
  * **Configuración:**
      * `main.jsx`: Se envuelve `<App />` con `<BrowserRouter>`. Esto "activa" el router.
      * `App.jsx`: Se definen las rutas principales. Se usa `<Routes>` como contenedor y `<Route>` para cada ruta individual.

### Axios (Configuración de Instancia):

  * **Propósito:** Cliente HTTP basado en promesas. Se prefiere sobre `fetch` porque maneja JSON automáticamente y permite **interceptors**.
  * **Interceptors:** Son funciones que "interceptan" **todas** las peticiones antes de que salgan (`request.use`) o **todas** las respuestas antes de que lleguen (`response.use`).
  * **Usos de Interceptors:**
      * `request.use`: Añadir el token de autenticación (`Authorization: Bearer...`) a **todas** las peticiones.
      * `response.use`: Manejar errores globales (ej. si la API devuelve 401, redirigir al login).

## (C) Ejemplos de Código

### Configuración del Router:

```javascript
// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// frontend/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './features/Home/HomePage.jsx';
import VendedoresPage from './features/Vendedores/VendedoresPage.jsx';
import VendedorFormPage from './features/Vendedores/VendedorFormPage.jsx';

function App() {
  return (
    <div>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vendedores" element={<VendedoresPage />} />
        <Route path="/vendedores/nuevo" element={<VendedorFormPage />} />
        <Route path="/vendedores/editar/:id" element={<VendedorFormPage />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </div>
  );
}
```

### Configuración del Cliente Axios:

```javascript
// frontend/src/services/api.js
import axios from 'axios';

// 1. Crear una instancia personalizada
const api = axios.create({
  // 2. Configurar la baseURL.
  // En producción (netlify): se usa VITE_API_URL (Sección 14)
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// 3. Ejemplo de interceptor de request 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. Exportar la instancia (NO axios por defecto)
export default api;
```

### Ejemplo de Llamada Axios desde un Componente:

```javascript
// frontend/src/features/Vendedores/VendedoresPage.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api.js'; 
// <-- Importamos nuestra instancia

function VendedoresPage() {
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    // 5. Usamos la instancia. Nota que la ruta es relativa ('/vendedores')
    api.get('/vendedores')
     .then(response => {
        setVendedores(response.data);
      })
     .catch(error => console.error('Error fetching data', error));
  }, []); // Array vacío para que se ejecute una vez

  //... render...
}
```

## (D) Consejos para el Examen

  * Crear una instancia de Axios en `services/api.js` es una **mejor práctica** fundamental.
  * Permite centralizar toda la configuración de la API. Si la URL de la API cambia, solo se cambia en un archivo, no en 20 componentes.
  * `react-router-dom v6` es el estándar. Recordar `BrowserRouter`, `Routes` y `Route`.

## (E) Preguntas Tipo Examen

**P: ¿Cuál es el propósito de `<BrowserRouter>` en `main.jsx`?**
R: Habilita el routing de React Router para toda la aplicación, conectando el router a la API de Historial del navegador.

**P: ¿Por qué crear una instancia de Axios (`axios.create`) es mejor que usar `axios.get(...)` directamente?**
R: Porque permite centralizar la configuración, como la `baseURL` y los `interceptors`, aplicando el principio DRY (Don't Repeat Yourself).

**P: ¿Para qué se usa un interceptor de `request` de Axios?**
R: Para modificar todas las peticiones antes de que se envíen. El caso de uso más común es adjuntar un token de autenticación (ej. JWT) a las cabeceras.

-----

# 11\) Componentes en el Front

## (A) Resumen Corto

  * Se dividen los componentes de React en dos tipos: "Contenedores" (o Smart) que manejan la lógica, el estado y el *fetch* de datos;
  * y "Presentacionales" (o Dumb) que solo reciben `props` y renderizan la UI.
  * Esta separación mejora la reutilización y la legibilidad del código.

## (B) Explicación Detallada

### Componentes Contenedores (Smart Components):

  * **Alias:** Smart, Features.
  * **Ubicación Canónica:** `frontend/src/features/`
  * **Responsabilidad:**
      * Manejar el estado (`useState`).
      * Ejecutar efectos secundarios (`useEffect`), como *fetching* de datos con `api.js`.
      * Pasar datos y *callbacks* (funciones) a los componentes presentacionales.
  * **Propósito:** Se preocupan por **cómo funcionan las cosas**.

### Componentes Presentacionales (Dumb Components):

  * **Alias:** Dumb, UI Components.
  * **Ubicación Canónica:** `frontend/src/components/`
  * **Responsabilidad:**
      * Renderizar la UI (JSX y CSS).
      * Recibir **todos** sus datos y funciones (callbacks) vía `props`.
      * **No** deben tener `useState` o `useEffect` (idealmente).
      * **No** deben llamar a la API directamente.
  * **Propósito:** Se preocupan por **cómo se ven las cosas**.

### Composición de Componentes:

  * Este patrón funciona por **composición**. Un componente Contenedor (ej. `VendedoresPage`) "compone" su UI usando varios componentes Presentacionales (ej. `<VendedorCard />`).

## (C) Ejemplos de Código

### Contenedor (Smart):

```javascript
// frontend/src/features/Vendedores/VendedoresPage.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import VendedorList from '../../components/VendedorList.jsx'; 
// Dumb

function VendedoresPage() {
  // 1. Es "Smart": Maneja estado y lógica
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Es "Smart": Realiza el fetch de datos
  useEffect(() => {
    api.get('/vendedores')
     .then(res => setVendedores(res.data))
     .finally(() => setLoading(false));
  }, []); // Array vacío

  if (loading) return <p>Cargando...</p>;

  // 3. Compone: Pasa los datos (vendedores) al componente "Dumb"
  return (
    <div>
      <h1>Nuestros Vendedores</h1>
      <VendedorList vendedores={vendedores} />
    </div>
  );
}
```

### Presentacional (Dumb):

```javascript
// frontend/src/components/VendedorList.jsx
import VendedorCard from './VendedorCard.jsx'; 
// Otro dumb

// 1. Es "Dumb": Solo recibe 'vendedores' como prop.
function VendedorList({ vendedores }) {
  // 2. Es "Dumb": Su única lógica es mapear y renderizar.
  return (
    <div className="list-container">
      {vendedores.map(v => (
        // 3. Compone usando otro componente "Dumb"
        <VendedorCard key={v.id} vendedor={v} />
      ))}
    </div>
  );
}
```

### Presentacional (Dumb) (Nivel más bajo):

```javascript
// frontend/src/components/VendedorCard.jsx 

// 1. Es "Dumb": Solo recibe 'vendedor' como prop.
function VendedorCard({ vendedor }) {
  // 2. Es "Dumb": Solo renderiza JSX.
  // No tiene estado ni efectos.
  return (
    <div className="card">
      <h3>{vendedor.nombre}</h3>
      <p>{vendedor.email}</p>
    </div>
  );
}
```

## (D) Consejos para el Examen

  * Este patrón es la "Arquitectura de Capas" del frontend.
  * `features/` (Contenedores) = Capa de Servicio/Lógica.
  * `components/` (Presentacionales) = Capa de Vista/UI.
  * Un buen componente "dumb" es altamente reutilizable. `VendedorCard` podría usarse en la `HomePage`, en un `VendedorRecomendadoWidget`, etc.

## (E) Preguntas Tipo Examen

**P: ¿Un componente "Presentacional" (Dumb) debe llamar a `useEffect` para cargar datos?**
R: No. Su responsabilidad es solo renderizar la UI. Debe recibir los datos como `props` desde un componente "Contenedor" (Smart), que es quien hace el `useEffect`.

**P: ¿Cuál es la principal ventaja de separar Contenedores de Presentacionales?**
R: Reutilización y Testeabilidad. Los componentes presentacionales se pueden probar fácilmente (dándoles props) y reutilizar. Los contenedores aíslan toda la lógica de estado y fetching.

-----

# 12\) useState y useEffect — Ejemplos en el Repo

## (A) Resumen Corto

  * `useState` y `useEffect` son los Hooks más fundamentales de React.
  * `useState` permite **declarar una variable de estado** que, al cambiar (con su función `set`), provoca que el componente se re-renderice.
  * `useEffect` permite **ejecutar "efectos secundarios"** (como fetch de datos) **después** de que el componente se renderiza.

## (B) Explicación Detallada

### `useState` (El Hook de Estado):

  * **Sintaxis:** `const [valor, setValor] = useState(valorInicial);`
  * **Qué hace:** Devuelve un array con dos elementos: el valor actual del estado y una función para actualizarlo.
  * **Cuándo usarlo:**
      * Para manejar campos de un formulario: `const [nombre, setNombre] = useState('');`
      * Para guardar datos de una API: `const [vendedores, setVendedores] = useState([]);`
      * Para manejar estados de UI: `const [loading, setLoading] = useState(true);`
      * Para manejar un error: `const [error, setError] = useState(null);`
  * **¡Importante\!** La única forma de cambiar `valor` es llamando a `setValor()`. Al hacerlo, React **re-renderiza** el componente.

### `useEffect` (El Hook de Efectos Secundarios):

  * **Sintaxis:** `useEffect(() => { /*...efecto... */ return () => { /*...limpieza... */ }; }, [dependencias]);`
  * **Qué hace:** Ejecuta la función de **efecto** (el primer argumento) **después** de que React haya renderizado el componente en el DOM.
  * **Cuándo usarlo:**
      * Para **fetch** de datos de una API cuando el componente se **monta**.
      * Para suscribirse a eventos (ej. `window.addEventListener`).
      * Para actualizar el DOM (ej. cambiar `document.title`).

### El Array de Dependencias (La parte más importante):

  * El segundo argumento de `useEffect` controla **cuándo** se re-ejecuta el efecto.
  * `[]` (Array vacío):
      * **Cuándo se ejecuta:** **Solo** una vez, después del primer render (cuando el componente se "monta").
      * **Uso ideal:** **Fetch** de datos iniciales.
  * `[prop, estado]` (Con valores):
      * **Cuándo se ejecuta:** Una vez al montar, y **cada vez** que los valores `prop` o `estado` cambien.
      * **Uso ideal:** Re-fetch de datos cuando un parámetro cambia (ej. `useEffect(..., [userId])`).
  * (Sin array):
      * **Cuándo se ejecuta:** Después de **cada** render del componente.
      * **Uso ideal:** Casi nunca. Esto usualmente causa **bucles infinitos** (ej. un fetch que llama a un `setState` que causa un re-render que causa otro fetch...).

## (C) Ejemplos de Código (Componente Contenedor)

```javascript
// frontend/src/features/Vendedores/VendedoresPage.jsx
import { useState, useEffect } from 'react'; 
import api from '../../services/api.js';
import VendedorList from '../../components/VendedorList.jsx';

function VendedoresPage() {
  // 1. useState: Declarar estado para datos, carga y error 
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect: Para fetch de datos
  useEffect(() => {
    // 3. Función async dentro del effect
    const fetchVendedores = async () => {
      try {
        setLoading(true); // Estado antes del fetch
        const response = await api.get('/vendedores');
        setVendedores(response.data); // Estado de éxito 
      } catch (err) {
        setError(err.message); // Estado de error
      } finally {
        setLoading(false); // Estado final (fin de carga)
      }
    };
    fetchVendedores();
  // 4. Array de dependencias vacío: Se ejecuta 1 SOLA VEZ al montar 
  }, []); 

  // 5. Renderizado condicional basado en el estado
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return <VendedorList vendedores={vendedores} />;
}
```

## (D) Consejos para el Examen

  * **Errores Comunes:**
      * **Bucle Infinito:** Olvidar el array `[]` en un `useEffect` que hace `setState`.
      * **Memory Leak (Fuga de Memoria):** Si se realiza una suscripción (ej. `setInterval`, `addEventListener`), **debe** limpiarse en la función de **retorno** de `useEffect`.

<!-- end list -->

```javascript
  useEffect(() => {
    const timerId = setInterval(() => console.log('tick'), 1000);
    
    // 6. Función de limpieza (se ejecuta al desmontar)
    return () => {
      clearInterval(timerId); 
    };
  }, []); // Array vacío
```

## (E) Preguntas Tipo Examen

**P: ¿Cuál es el propósito del array de dependencias en `useEffect`?**
R: Controla cuándo se re-ejecuta la función de efecto. Si está vacío `[]`, se ejecuta solo una vez al montar. Si tiene variables, se re-ejecuta cuando esas variables cambian.

**P: ¿Se puede llamar a `useState` dentro de un `if` o un `for`?**
R: No. Los Hooks siempre deben llamarse en el nivel superior del componente, nunca dentro de condicionales, bucles o funciones anidadas.

**P: ¿Cómo se almacena el resultado de un fetch (hecho en `useEffect`) para mostrarlo en el render?**
R: Se usa `useState` para declarar una variable de estado (ej. `vendedores`), y en el `.then()` (o `try`) del fetch, se llama a la función `setVendedores` con los datos recibidos.

-----

# 13\) Validaciones (Frontend y Backend)

## (A) Resumen Corto

  * La validación es crucial y debe existir en **dos** lugares.
  * En el **Frontend**, para dar **feedback inmediato** al usuario (mejor UX).
  * En el **Backend** (usando el Esquema de Mongoose), como la **línea de defensa final** para garantizar la **integridad de los datos**, ya que el frontend puede ser saltado.

## (B) Explicación Detallada

### 1\. Validación en Frontend (Cliente):

  * **Propósito:** Experiencia de Usuario (UX). Evitar un viaje de red innecesario.
  * **Tecnología:** Atributos HTML5 (`required`, `minLength`, `type="email"`) o validación de estado simple en React.
  * **Flujo:** El usuario presiona "Guardar". El `handleSubmit` de React comprueba el estado.
  * Si `nombre === ''`, muestra un error en la UI (`setFormError('El nombre es requerido')`) y **no** llama a Axios.
  * **Importante:** Esta validación es **insegura** y puede ser **bypasseada** (ej. usando Postman).

### 2\. Validación en Backend (Servidor):

  * **Propósito:** Seguridad e Integridad de Datos. Es la **fuente de verdad**.
  * **Tecnología:** Mongoose Schemas.
  * **Flujo:**
    1.  El Controller recibe la petición de Axios.
    2.  Llama al Service -\> Repository -\> `VendedorModel.create(req.body)`.
    3.  **Antes** de tocar la DB, Mongoose comprueba los datos (`req.body`) contra el `vendedorSchema`.
    4.  Si falla (ej. falta `nombre` `required`), Mongoose **lanza un error de validación** (`ValidationError`).
    5.  El `try/catch` del Controller (Sección 5) captura este error.
    6.  `next(error)` pasa el error al **handler** centralizado, que devuelve un `400 Bad Request`.

## (C) Ejemplos de Código

### Frontend (Validación simple de UX):

```javascript
// frontend/src/components/VendedorForm.jsx
function VendedorForm({ onSave }) {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 1. Validación de cliente
    if (!nombre) {
      setError('El nombre es obligatorio');
      return; // No llama a la API
    }
    setError(null);
    onSave({ nombre });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={nombre} onChange={e => setNombre(e.target.value)} />
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button type="submit">Guardar</button>
    </form>
  );
}
```

### Backend (Validación de Integridad):

```javascript
// backend/src/models/Vendedor.model.js
import mongoose from 'mongoose';

const vendedorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'], 
    minLength: [3, 'El nombre debe tener al menos 3 caracteres']
  },
  email: {
    type: String,
    required: true,
    match: /^\S+@\S+\.\S+$/, 
    unique: true // Esto es un índice, no un validador (pero relacionado)
  },
  categoria: {
    type: String,
    enum: ['ropa', 'tecnologia'] // Solo permite estos valores
  }
});

// 2. Mongoose usa este schema para validar en .create() o .save()
const VendedorModel = mongoose.model('Vendedor', vendedorSchema);
export default VendedorModel;
```

## (D) Consejos para el Examen

  * El flujo completo de un error de validación del backend:
    1.  Axios envía datos malos (`{}`).
    2.  Mongoose `create()` falla y lanza `ValidationError`.
    3.  Controller `catch` lo captura -\> `next(err)`.
    4.  `ErrorHandler` lo recibe -\> `res.status(400).json(err.message)`.
    5.  Axios `.catch(err)` en el frontend recibe el error 400.
  * Nunca se debe confiar en la validación del cliente; es solo por conveniencia del usuario.

## (E) Preguntas Tipo Examen

**P: ¿Por qué es necesaria la validación en el backend si ya se validó en el frontend?**
R: Porque la validación del frontend es solo para UX y puede ser fácilmente saltada por un atacante o un cliente API (como Postman). La validación del backend es la única que garantiza la integridad de los datos en la base de datos.

**P: ¿Cómo se define un validador de `required` en Mongoose y qué tipo de respuesta debe generar si falla?**
R: Se define como `{ type: String, required: [true, 'Mensaje'] }`. Si falla, el controlador debe capturar el error y devolver un `400 Bad Request`.

-----

# 14\) Despliegue y CI/CD (Netlify + Render)

## (A) Resumen Corto

  * Se despliega el proyecto (asumiendo un monorepo) usando dos servicios: **Netlify** para el Frontend (React) y **Render** para el Backend (Node/Express).
  * La clave es configurar correctamente los "directorios base" en cada servicio y usar "Variables de Entorno" para conectar el frontend (Netlify) con el backend (Render).

## (B) Explicación Detallada

### 1\. Desplegar el Backend (Node/Express) en Render:

  * **Servicio:** Render.com (Plan gratuito para "Web Service").
  * **Proceso:** Conectar el repositorio de GitHub.
  * **Configuración (para un Monorepo):**
      * **Root Directory:** `backend` (Le dice a Render que mire dentro de esta carpeta).
      * **Build Command:** `npm install` (o `yarn`).
      * **Start Command:** `node src/index.js` (o el script `npm start` si `package.json` está configurado).
  * **Variables de Entorno:** (Se configuran en el Dashboard de Render)
      * `DATABASE_URL`: La cadena de conexión a la base de datos MongoDB Atlas (la de producción, no la local).
      * `CORS_ORIGIN`: `https://tu-sitio-frontend.netlify.app` (¡CRÍTICO\! La URL del sitio de Netlify).
      * `NODE_ENV`: `production`.

### 2\. Desplegar el Frontend (React) en Netlify:

  * **Servicio:** Netlify.com (Plan gratuito).
  * **Proceso:** Conectar el mismo repositorio de GitHub.
  * **Configuración (para un Monorepo):**
      * **Base Directory:** `frontend` (Le dice a Netlify que mire dentro de esta carpeta).
      * **Build Command:** `npm run build` (o `react-scripts build`).
      * **Publish Directory:** `frontend/dist` (o `dist` si el Base Directory ya es `frontend`). *Nota: Create React App usa `build`, Vite usa `dist`*.
  * **Variables de Entorno:** (Se configuran en el Dashboard de Netlify)
      * `VITE_API_URL` (o `REACT_APP_API_URL`): `https://tu-api-backend.onrender.com` (¡CRÍTICO\! La URL del servicio de Render).
  * **Configuración de SPA (Single Page Application):**
      * React Router necesita una regla de *rewrite* para que las rutas (ej. `/vendedores/123`) funcionen al recargar la página.
      * Se crea un archivo `frontend/netlify.toml` (o `frontend/public/_redirects`):

<!-- end list -->

```toml
# frontend/netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### La Conexión FE/BE en Producción:

  * El error más común es el fallo de conexión entre el front y el back desplegados.
  * **Flujo:**
    1.  El usuario visita `https://mi-front.netlify.app`.
    2.  React (`VendedoresPage.jsx`) ejecuta `api.get('/vendedores')`.
    3.  Axios (`api.js`) usa la variable `VITE_API_URL` y transforma la llamada en: `https://mi-back.onrender.com/api/vendedores`.
    4.  La petición llega al servidor de Render.
    5.  Render (Express) comprueba el middleware `cors()`.
    6.  `cors()` mira la variable `CORS_ORIGIN` y ve que la petición viene de `https://mi-front.netlify.app`, que **sí** está permitido.
    7.  El backend procesa la petición y devuelve los datos.

## (D) Consideraciones al Desplegar una Nueva Versión

  * **CI/CD:** Netlify y Render se re-desplegarán automáticamente cada vez que se haga `git push` a la rama `main`.
  * **Variables de Entorno:** Si se añade una nueva variable (ej. `API_KEY_NUEVA`), **debe** añadirse manualmente a la UI de Render/Netlify **antes** de desplegar el código que la usa.
  * **Migraciones de DB:** Si se cambia el Schema (ej. se añade un campo `required`), los documentos antiguos no lo tendrán. Esto puede requerir un *script de migración* (más avanzado).

## (E) Preguntas Tipo Examen

**P: ¿Qué comando de build y directorio de publicación se usarían para un proyecto Create React App en Netlify?**
R: Comando: `npm run build` (o `react-scripts build`). Directorio: `build`.

**P: ¿Qué comando de inicio se usaría para un backend de Express en Render?**
R: `node src/index.js` (o el script `npm start`).

**P: ¿Qué dos variables de entorno son esenciales para conectar un frontend de Netlify y un backend de Render?**
R: 1. En Netlify, `VITE_API_URL` (o `REACT_APP_API_URL`) apuntando a la URL de Render. 2. En Render, `CORS_ORIGIN` apuntando a la URL de Netlify.

-----

# 15\) Añadir Nueva Funcionalidad — Caso Práctico (Reseñas y Calificaciones)

## (A) Resumen Corto

  * Se implementará un sistema de reseñas y calificaciones para los "Vendedores".
  * Se analizará el modelado de datos (Referencia vs. Incrustación), decidiendo por un modelo híbrido (Referencia para reseñas, Incrustación para el promedio), y se detallarán los cambios necesarios en el Modelo, Backend (Rutas, Servicios) y Frontend (Componentes, Axios).

## (B) Explicación Detallada

### 1\. Modelado de Base de Datos (Mongo/Mongoose):

  * **El Debate:**
      * **Opción 1: Incrustación (Embedding):** Añadir un array `reviews: []` dentro del `Vendedor.model.js`.
          * **Pros:** Lecturas rápidas (se obtiene el vendedor y **todas** sus reseñas en 1 consulta).
          * **Contras:** Las reseñas son "ilimitadas" (one-to-many). Esto puede hacer que el documento del vendedor supere el límite de 16MB de MongoDB y ralentiza las escrituras.
      * **Opción 2: Referencia (Referencing):** Crear una nueva colección `Reviews`.
          * **Pros:** Escalable. Los documentos de Vendedor y Review son pequeños y rápidos de escribir.
          * **Contras:** Se requieren 2 consultas (o un `$lookup`) para obtener un vendedor y sus reseñas.
  * **Decisión (El Patrón Híbrido):** Se usará **Referencia** (Opción 2) para las reseñas (escalabilidad), pero también se **Incrustarán** los **datos agregados** (el promedio) en el Vendedor para lecturas rápidas.

### Nuevos/Actualizados Schemas:

```javascript
// backend/src/models/Review.model.js (NUEVO)
import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema({
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  // Referencia al Vendedor (Padre)
  vendedor: { 
    type: Schema.Types.ObjectId, 
    ref: 'Vendedor', 
    required: true 
  },
  // (Opcional: referencia al usuario que la escribió)
  // user: { type: Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true }); 
// timestamps: true (añade createdAt)

export default mongoose.model('Review', reviewSchema);
```

```javascript
// backend/src/models/Vendedor.model.js (ACTUALIZADO)
//... (schema existente)
const vendedorSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  // Campos agregados para lecturas rápidas
  ratingAvg: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5 
  },
  reviewCount: { 
    type: Number, 
    default: 0 
  }
});
//... (export)
```

### 2\. Backend (Rutas, Controllers, Services):

  * **Nuevas Rutas:** Se deben crear nuevos endpoints para manejar las reseñas, siguiendo las mejores prácticas de REST (recursos anidados).
  * **Archivo:** `backend/src/routes/vendedor.routes.js` (Modificado)

<!-- end list -->

```javascript
// Se anidan las rutas de reseñas bajo el vendedor

// POST /api/vendedores/:vendedorId/reviews
router.post('/:vendedorId/reviews', ReviewController.createReview);

// GET /api/vendedores/:vendedorId/reviews
router.get('/:vendedorId/reviews', ReviewController.getReviewsForVendedor);
```

  * **Nuevos Controller y Service:**
      * **Archivos:** `review.controller.js`, `review.service.js`, `review.repository.js` (NUEVOS).
  * **Lógica de Negocio Clave (en `review.service.js`):**
      * Al crear una reseña, se debe **actualizar** el Vendedor.

<!-- end list -->

```javascript
// backend/src/services/review.service.js (Extracto)
import * as reviewRepo from '../repositories/review.repository.js';
import * as vendedorRepo from '../repositories/vendedor.repository.js';
// Importamos el repo de Vendedor

export const createReview = async (vendedorId, reviewData) => {
  // 1. Crear la reseña
  const newReview = await reviewRepo.create({...reviewData, vendedor: vendedorId });
  
  // 2. Recalcular el promedio del vendedor 
  // Esto se debe hacer con una agregación de MongoDB
  const stats = await reviewRepo.calculateVendedorStats(vendedorId);
  
  // 3. Actualizar el documento Vendedor
  await vendedorRepo.update(vendedorId, {
    ratingAvg: stats.average,
    reviewCount: stats.count
  });
  
  return newReview;
};
```

### Nuevos Endpoints (Request/Response):

  * **Crear Reseña:**
      * **Endpoint:** `POST /api/vendedores/60d5ec49f76a5b3a8c8f8b1a/reviews`
      * **Request Body:** `{ "comment": "Muy bueno", "rating": 5 }`
      * **Response (201):** `{ "id": "...", "comment": "Muy bueno", "rating": 5,... }`
  * **Obtener Reseñas de un Vendedor:**
      * **Endpoint:** `GET /api/vendedores/60d5ec49f76a5b3a8c8f8b1a/reviews`
      * **Response (200):** `[ { "comment": "Muy bueno", "rating": 5 }, { "comment": "Mas o menos", "rating": 3 } ]`

### 3\. Frontend (Componentes, Rutas, Axios):

  * **Nuevas Rutas Frontend:**

      * No se necesitan nuevas rutas de página, pero sí nuevos componentes **dentro** de la página de detalle del vendedor.

  * **Componentes a Crear/Modificar:**

      * `features/Vendedores/VendedorDetailPage.jsx` (MODIFICADO):
          * Haría **dos** llamadas a la API:
              * `api.get(/vendedores/${id})` (para los datos del vendedor)
              * `api.get(/vendedores/${id}/reviews)` (para la lista de reseñas)
          * Renderizaría `<ReviewList reviews={reviews} />`.
          * Renderizaría `<ReviewForm vendedorId={id} onReviewSubmit={handleRefreshReviews} />`.
      * `components/ReviewList.jsx` (NUEVO - Dumb):
          * Recibe `reviews` como prop y las mapea.
      * `components/ReviewForm.jsx` (NUEVO - Dumb/Smart Sencillo):
          * Maneja el estado del formulario (`comment`, `rating`).
          * Llama a `api.post(/vendedores/${vendedorId}/reviews, {... })` al hacer submit.

  * **Ejemplo de Llamada Axios (en `ReviewForm.jsx`):**

<!-- end list -->

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post(`/vendedores/${vendedorId}/reviews`, { 
      comment, 
      rating 
    });
    onReviewSubmit(); // Llama al callback del padre para refrescar la lista
  } catch (error) {
    console.error('Error al enviar reseña', error);
  }
};
```

### 4\. Checklist Final (Archivos a Tocar/Crear):

  * **Backend:**
      * `models/Review.model.js` (Nuevo)
      * `models/Vendedor.model.js` (Modificado)
      * `routes/vendedor.routes.js` (Modificado)
      * `routes/review.routes.js` (Nuevo, o anidado como se mostró)
      * `controllers/review.controller.js` (Nuevo)
      * `services/review.service.js` (Nuevo)
      * `repositories/review.repository.js` (Nuevo)
      * `repositories/vendedor.repository.js` (Modificado, para añadir `update`)
  * **Frontend:**
      * `features/Vendedores/VendedorDetailPage.jsx` (Modificado)
      * `components/ReviewList.jsx` (Nuevo)
      * `components/ReviewForm.jsx` (Nuevo)
      * (Opcional) `components/StarRating.jsx` (Nuevo)

## (D) Consejos para el Examen

  * La decisión de modelado es la parte más crítica de esta pregunta.
  * Se debe justificar por qué "Referencia" es mejor que "Incrustación" para datos "one-to-many" ilimitados como las reseñas.
  * El patrón "híbrido" (referenciar los datos, pero incrustar el agregado) es una solución de nivel experto que balancea rendimiento de lectura y escritura.

## (E) Preguntas Tipo Examen

**P: ¿Cuál es el principal riesgo de "incrustar" (embedding) las reseñas (un array) dentro del documento del Vendedor?**
R: El riesgo de que el documento supere el límite de 16MB de MongoDB y que las operaciones de escritura (añadir una reseña) se vuelvan lentas, ya que deben reescribir un documento cada vez más grande.

**P: Si se usa "referencias" (nueva colección Reviews), ¿cómo se puede mostrar eficientemente el rating promedio en la lista de vendedores sin hacer N+1 consultas?**
R: Aplicando un patrón híbrido: se almacenan `ratingAvg` y `reviewCount` calculados como campos en el propio documento Vendedor. Estos campos se actualizan (vía el `review.service`) cada vez que se añade o elimina una nueva reseña.

-----

# Resumen Ejecutivo y Material de Estudio Adicional

## Resumen Ejecutivo

Este informe ha diseccionado la arquitectura de una aplicación MERN (MongoDB, Express, React, Node.js) canónica.
Se ha trazado el flujo de una petición desde el `onClick` en React, a través del enrutador de React y el cliente Axios, hasta el backend de Express.
En el backend, se aplica una estricta Arquitectura de Capas, separando Routes (HTTP), Controllers (Orquestación), Services (Lógica de Negocio) y Repositories (Abstracción de Datos).
Se ha enfatizado cómo `async/await` y un `handler` de errores centralizado crean una aplicación robusta, y cómo el despliegue en Netlify y Render se conecta mediante variables de entorno.

## 10 Tarjetas de Estudio (Flashcards)

**P: ¿Qué es el "Patrón Repositorio"?**
R: Una capa de abstracción (`repositories`) que aísla la Lógica de Negocio (`services`) del acceso directo a la base de datos (`Mongoose models`).

**P: ¿Cuántos argumentos tiene un middleware de errores de Express y por qué?**
R: Cuatro: `(err, req, res, next)`. La presencia de `err` le indica a Express que es un manejador de errores.

**P: ¿Qué hace `next(err)`?**
R: Salta todos los middlewares regulares y va directo al manejador de errores de 4 argumentos.

**P: ¿Qué hace `async/await` con los errores?**
R: Si una promesa `await` es rechazada, `await` lanza una excepción (throw), permitiendo que sea capturada por un `try/catch`.

**P: ¿Para qué sirve el array de dependencias `[]` en `useEffect`?**
R: Para que el efecto se ejecute una sola vez cuando el componente se monta. Ideal para el fetch inicial de datos.

**P: ¿Contenedor (Smart) vs. Presentacional (Dumb)?**
R: Contenedor: Maneja estado y fetch (lógica). Presentacional: Solo recibe props y renderiza JSX (vista).

**P: ¿Cómo envía datos un componente Hijo a uno Padre?**
R: El Padre pasa una función (callback) como prop al Hijo. El Hijo ejecuta esa prop con los datos.

**P: ¿Validación: Frontend vs. Backend?**
R: Frontend = UX (experiencia de usuario). Backend (Mongoose Schema) = Integridad de Datos (seguridad).

**P: ¿Qué dos variables de entorno conectan Netlify (FE) y Render (BE)?**
R: En Netlify: `VITE_API_URL` (con la URL de Render). En Render: `CORS_ORIGIN` (con la URL de Netlify).

**P: ¿Modelado de Reseñas: Incrustar o Referenciar?**
R: Referenciar (nueva colección `Reviews`). Es más escalable para relaciones "one-to-many" ilimitadas.

## 10 Preguntas Tipo Examen (Adicionales)

**P: ¿En qué capa (Controller, Service, Repository) se pondría la lógica para recalcular el `ratingAvg` de un Vendedor?**
R: En el `ReviewService`. Es Lógica de Negocio que coordina dos repositorios (crear en `ReviewRepo`, actualizar en `VendedorRepo`).

**P: Escribir la configuración de Netlify (`netlify.toml`) para una SPA de React.**
R: `[[redirects]] / from = "/*" / to = "/index.html" / status = 200`.

**P: ¿Por qué un POST no es idempotente, pero un PUT sí lo es?**
R: `POST /recurso` N veces crea N recursos. `PUT /recurso/123` N veces actualiza el mismo recurso 123 al mismo estado.

**P: ¿Cuál es la diferencia entre `req.params` y `req.query`?**
R: `req.params` es para parámetros de ruta (ej. `/:id` en `/vendedores/123`). `req.query` es para filtros (ej. `?filtro=...` en `/vendedores?categoria=ropa`).

**P: ¿Qué hace `e.preventDefault()` en un formulario de React?**
R: Evita que el navegador realice su acción por defecto (recargar la página) al enviar el formulario, permitiendo que React maneje el envío.

**P: ¿Es `VendedorModel.findById()` una operación síncrona o asíncrona?**
R: Asíncrona. Toda operación de base de datos (I/O) devuelve una Promesa y debe usarse con `await`.

**P: ¿Cuál es el riesgo de omitir el array de dependencias en `useEffect`?**
R: Provoca que el efecto se ejecute después de cada render. Si el efecto actualiza el estado (`setState`), esto causa un bucle infinito de re-renders.

**P: ¿Qué código de estado HTTP se debe devolver para un POST exitoso?**
R: `201 Created`.

**P: ¿Qué código de estado HTTP se debe devolver si un usuario busca un `GET /vendedores/id-que-no-existe`?**
R: `404 Not Found`.

**P: ¿Qué es un "componente controlado" en React?**
R: Un input de formulario cuyo valor está vinculado (`value={...}`) a una variable de estado (`useState`) y se actualiza solo a través de su evento (`onChange={...}`).

```
