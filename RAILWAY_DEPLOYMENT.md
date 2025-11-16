# 🚂 Despliegue en Railway.app - Guía Paso a Paso

## ¿Por qué Railway?

✅ Soporta Docker nativamente  
✅ MongoDB incluido (gratis)  
✅ Deploy automático desde GitHub  
✅ Plan gratuito generoso  
✅ URL HTTPS automático  

---

## 📋 PASO 1: Preparar el Código

### 1.1 Commit todos los cambios

```bash
cd /c/Users/lucas/Desarrollo\ de\ Software/tp/2025-2c-backend-grupo-02

# Ver qué cambios hay
git status

# Agregar todo
git add .

# Commit
git commit -m "feat: agregar Docker, tests E2E, y documentación completa"

# Push a tu rama
git push origin lucas_m_despliegue
```

### 1.2 (Opcional) Merge a main

Si querés deployar desde `main`:
```bash
git checkout main
git merge lucas_m_despliegue
git push origin main
```

---

## 🚂 PASO 2: Desplegar Backend en Railway

### 2.1 Crear cuenta en Railway

1. Ve a https://railway.app/
2. Click en **"Start a New Project"**
3. Inicia sesión con GitHub
4. Autoriza Railway a acceder a tus repositorios

### 2.2 Crear Proyecto

1. Click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona: `ddsw-mn/2025-2c-backend-grupo-02`
4. Railway detectará automáticamente el monorepo

### 2.3 Configurar el Servicio Backend

1. Railway te preguntará qué quieres deployar
2. Selecciona **"Deploy"** para crear un servicio
3. En la configuración:
   - **Root Directory**: `packages/backend`
   - **Dockerfile Path**: `packages/backend/Dockerfile`
   - Railway detectará el Dockerfile automáticamente

### 2.4 Agregar MongoDB

1. En tu proyecto Railway, click en **"+ New"**
2. Selecciona **"Database"** → **"Add MongoDB"**
3. Railway creará una instancia de MongoDB automáticamente
4. Copia el connection string que aparece

### 2.5 Configurar Variables de Entorno

1. Click en tu servicio backend
2. Ve a la pestaña **"Variables"**
3. Agrega estas variables:

```bash
# MongoDB (Railway te da esto automáticamente)
MONGO_URI=${{MongoDB.MONGO_URL}}

# JWT Secret (genera uno aleatorio)
JWT_SECRET=tu_secreto_super_seguro_railway_2024

# Puerto (Railway usa esta variable)
PORT=3000

# Node Environment
NODE_ENV=production

# CORS (agregar después de desplegar frontend)
ALLOWED_ORIGINS=http://localhost:3001
```

**Truco de Railway**: Usa `${{MongoDB.MONGO_URL}}` para referenciar automáticamente tu MongoDB

### 2.6 Deploy

1. Railway iniciará el build automáticamente
2. Verás los logs en tiempo real
3. Espera a que termine (2-5 minutos)
4. Una vez completado, Railway te dará una URL:
   ```
   https://tu-proyecto-production.up.railway.app
   ```

### 2.7 Verificar Backend

Abre en el navegador:
```
https://tu-proyecto-production.up.railway.app/api/health
```

Deberías ver: `{"status":"ok"}`

---

## 🌐 PASO 3: Desplegar Frontend en Vercel

### 3.1 Crear cuenta en Vercel

1. Ve a https://vercel.com/
2. Click en **"Sign Up"**
3. Inicia sesión con GitHub
4. Autoriza Vercel

### 3.2 Importar Proyecto

1. En Vercel Dashboard, click en **"Add New..."** → **"Project"**
2. Busca `2025-2c-backend-grupo-02`
3. Click en **"Import"**

### 3.3 Configurar el Proyecto

En la pantalla de configuración:

```yaml
Project Name: tp-frontend-grupo02

Framework Preset: Create React App

Root Directory: packages/frontend

Build Command: npm run build

Output Directory: build
```

### 3.4 Variables de Entorno

En **"Environment Variables"**, agrega:

```bash
# IMPORTANTE: Usa la URL de Railway
REACT_APP_API_URL=https://tu-proyecto-production.up.railway.app/api
```

⚠️ **Reemplaza** `tu-proyecto-production.up.railway.app` con tu URL real de Railway

### 3.5 Deploy

1. Click en **"Deploy"**
2. Vercel construirá tu frontend (2-3 minutos)
3. Te dará una URL como:
   ```
   https://tp-frontend-grupo02.vercel.app
   ```

---

## 🔗 PASO 4: Conectar Frontend y Backend

### 4.1 Actualizar CORS en Railway

1. Ve a tu proyecto en Railway
2. Click en el servicio **backend**
3. Ve a **"Variables"**
4. Actualiza `ALLOWED_ORIGINS`:

```bash
ALLOWED_ORIGINS=http://localhost:3001,https://tp-frontend-grupo02.vercel.app
```

⚠️ Reemplaza con tu URL real de Vercel

5. Guarda y Railway redesplegará automáticamente

### 4.2 Verificar Conexión

1. Abre tu frontend en Vercel: `https://tp-frontend-grupo02.vercel.app`
2. Abre DevTools (F12) → Network
3. Recarga la página
4. Deberías ver peticiones a tu backend de Railway exitosas (200 OK)
5. NO deberías ver errores de CORS

---

## ✅ Verificación Completa

### Checklist de Verificación

- [ ] **Backend en Railway**
  - [ ] URL funciona: `https://tu-backend.up.railway.app/api/health`
  - [ ] Swagger accesible: `https://tu-backend.up.railway.app/api-docs`
  - [ ] MongoDB conectado (sin errores en logs)
  - [ ] Variables de entorno configuradas

- [ ] **Frontend en Vercel**
  - [ ] URL funciona: `https://tu-frontend.vercel.app`
  - [ ] Productos se cargan (llama al backend)
  - [ ] No hay errores de CORS en consola
  - [ ] Login/Registro funcionan

- [ ] **Integración**
  - [ ] Frontend puede llamar al backend
  - [ ] CORS configurado correctamente
  - [ ] Agregar al carrito funciona
  - [ ] Toda la aplicación es usable

---

## 🎯 URLs Finales

Una vez desplegado, tendrás:

```
Backend (Railway):  https://______________.up.railway.app
Frontend (Vercel):  https://______________.vercel.app
API Docs:           https://______________.up.railway.app/api-docs
MongoDB:            (privado en Railway)
```

---

## 🔄 Redespliegue Automático (CI/CD)

Una vez configurado:

✅ **Push a GitHub** → Railway y Vercel redesplegan automáticamente  
✅ **Pull Request** → Vercel crea preview automático  
✅ **Merge a main** → Despliegue a producción  

---

## 💰 Costos

**Railway Free Tier:**
- $5 USD de crédito/mes
- ~500 horas de ejecución
- MongoDB incluido
- Suficiente para proyectos estudiantiles

**Vercel Free Tier:**
- 100 GB bandwidth/mes
- Deploy ilimitados
- HTTPS automático
- Perfecto para frontend estático

**Total: $0** para este proyecto 🎉

---

## 🐛 Troubleshooting

### Backend no responde

```bash
# Ver logs en Railway
# Ve a tu proyecto → Backend → Logs
```

Problemas comunes:
- Variables de entorno mal configuradas
- MongoDB no conectado
- Puerto incorrecto

### Error de CORS

```bash
# Verificar ALLOWED_ORIGINS en Railway
# Debe incluir la URL completa de Vercel (con https://)
```

### Frontend no conecta al backend

```bash
# Verificar en Vercel → Settings → Environment Variables
# REACT_APP_API_URL debe apuntar a Railway
```

Después de cambiar variables en Vercel:
1. Ve a Deployments
2. Click en el último deployment
3. Click en "Redeploy"

---

## 📚 Recursos

- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [Documentación completa del proyecto](../DOCKER_DEPLOYMENT.md)

---

## ✨ ¡Listo!

Tu aplicación ahora está en internet y accesible desde cualquier parte del mundo.

**Siguiente paso**: Comparte las URLs con tu equipo y profesores.
