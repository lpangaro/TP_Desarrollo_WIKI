# 🐳 Guía de Despliegue con Docker

Esta guía documenta el proceso completo de despliegue utilizando contenedores Docker, siguiendo las mejores prácticas de CI/CD y despliegue moderno.

## 📋 Tabla de Contenidos

1. [Introducción a Docker](#introducción-a-docker)
2. [Requisitos Previos](#requisitos-previos)
3. [Arquitectura de Contenedores](#arquitectura-de-contenedores)
4. [Despliegue Local con Docker](#despliegue-local-con-docker)
5. [Despliegue en Producción](#despliegue-en-producción)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Estrategias de Deployment](#estrategias-de-deployment)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Introducción a Docker

### ¿Qué es un Contenedor?

Un **contenedor** es una unidad estándar de software que empaqueta el código y todas sus dependencias para que la aplicación se ejecute de manera rápida y confiable en diferentes entornos.

**Características principales:**
- ✅ **Ligereza**: Comparten el kernel del sistema operativo (MB vs GB de las VMs)
- ✅ **Portabilidad**: "Funciona en mi máquina" deja de ser un problema
- ✅ **Aislamiento**: Los cambios en un contenedor no afectan al sistema ni a otros contenedores
- ✅ **Velocidad**: Arranque casi instantáneo (milisegundos)
- ✅ **Escalabilidad**: Ideales para arquitecturas de microservicios

### Contenedores vs Máquinas Virtuales

| Característica | Contenedores | Máquinas Virtuales |
|----------------|--------------|-------------------|
| **Aislamiento** | A nivel de proceso/SO | Hardware completo |
| **Tamaño** | Livianos (MB) | Pesados (GB) |
| **Velocidad de inicio** | Milisegundos | Segundos a minutos |
| **SO incluido** | No (usa el del host) | Sí (SO completo por VM) |
| **Eficiencia** | Alta | Menor |
| **Casos de uso** | Microservicios, CI/CD | Apps legadas, aislamiento completo |

### Componentes de Docker

- **Dockerfile**: Archivo de configuración para crear imágenes
- **Imagen**: Plantilla inmutable a partir de la cual se crean contenedores
- **Contenedor**: Instancia en ejecución de una imagen
- **Docker Compose**: Herramienta para definir y ejecutar aplicaciones multi-contenedor
- **Docker Hub**: Repositorio para compartir imágenes

---

## 📦 Requisitos Previos

### Software Necesario

- **Docker Desktop** (Windows/Mac) o **Docker Engine** (Linux)
  - Descarga: https://www.docker.com/products/docker-desktop
  - Versión mínima: 20.10.x
- **Docker Compose** (incluido en Docker Desktop)
  - Versión mínima: 2.0.x

### Verificar Instalación

```bash
# Verificar Docker
docker --version
# Salida esperada: Docker version 24.x.x

# Verificar Docker Compose
docker compose version
# Salida esperada: Docker Compose version v2.x.x

# Verificar que Docker está corriendo
docker ps
# Debe mostrar una tabla vacía sin errores
```

### Conocimientos Recomendados

- Conceptos básicos de Docker
- Comandos básicos de terminal/bash
- Conceptos de redes y puertos
- Variables de entorno

---

## 🏗️ Arquitectura de Contenedores

Nuestro proyecto utiliza **3 contenedores** orquestados con Docker Compose:

```
┌─────────────────────────────────────────────────┐
│                  tp-network                      │
│  (Red Docker para comunicación interna)         │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────┐│
│  │   MongoDB    │  │   Backend    │  │Frontend││
│  │   (mongo:7)  │◄─┤  (Node.js)   │◄─┤ (Nginx)││
│  │   :27017     │  │   :3000      │  │  :80   ││
│  └──────────────┘  └──────────────┘  └────────┘│
│         ▲                 ▲               ▲     │
└─────────┼─────────────────┼───────────────┼─────┘
          │                 │               │
      Volumen          Hot Reload        Puerto
   (persistencia)    (desarrollo)      expuesto
```

### Servicios

#### 1. **MongoDB** (`mongodb`)
- **Imagen**: `mongo:7.0`
- **Puerto**: 27017
- **Usuario**: admin / admin123
- **Base de datos**: tienda_db
- **Persistencia**: Volumen `mongodb_data`

#### 2. **Backend** (`backend`)
- **Base**: Node.js 18 Alpine
- **Puerto**: 3000
- **Dependencias**: MongoDB
- **Variables**: MONGO_URI, JWT_SECRET, etc.

#### 3. **Frontend** (`frontend`)
- **Base**: Nginx Alpine (multi-stage build)
- **Puerto**: 80
- **Dependencias**: Backend
- **Características**: React SPA con soporte para React Router

---

## 🚀 Despliegue Local con Docker

### Paso 1: Clonar y Configurar

```bash
# Clonar el repositorio (si no lo tienes)
git clone https://github.com/ddsw-mn/2025-2c-backend-grupo-02.git
cd 2025-2c-backend-grupo-02

# Cambiar a la rama de despliegue
git checkout lucas_m_despliegue
```

### Paso 2: Configurar Variables de Entorno

#### Backend
```bash
# Copiar el archivo de ejemplo
cp packages/backend/.env.example packages/backend/.env

# Editar si es necesario (opcional para desarrollo local)
```

#### Frontend
```bash
# Copiar el archivo de ejemplo
cp packages/frontend/.env.example packages/frontend/.env

# Para Docker, la URL del backend ya está configurada correctamente
```

### Paso 3: Construir las Imágenes

```bash
# Construir todas las imágenes definidas en docker-compose.yml
docker compose build

# Esto puede tomar 3-5 minutos la primera vez
```

**Lo que sucede:**
- Se descarga la imagen base de Node.js 18 Alpine (~50MB)
- Se instalan las dependencias del backend
- Se construye el frontend (React build)
- Se descarga Nginx Alpine para servir el frontend
- Se descarga MongoDB 7.0

### Paso 4: Iniciar los Contenedores

```bash
# Iniciar todos los servicios en modo detached (background)
docker compose up -d

# Ver los logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
```

### Paso 5: Verificar el Despliegue

```bash
# Ver el estado de los contenedores
docker compose ps

# Salida esperada:
# NAME          IMAGE               STATUS         PORTS
# tp-backend    backend:latest      Up X seconds   0.0.0.0:3000->3000/tcp
# tp-frontend   frontend:latest     Up X seconds   0.0.0.0:80->80/tcp
# tp-mongodb    mongo:7.0           Up X seconds   0.0.0.0:27017->27017/tcp
```

#### Verificar endpoints:

1. **Frontend**: http://localhost
2. **Backend API**: http://localhost:3000/api/health
3. **Swagger Docs**: http://localhost:3000/api-docs
4. **MongoDB**: localhost:27017 (usar MongoDB Compass o cliente)

### Comandos Útiles

```bash
# Detener todos los contenedores
docker compose stop

# Iniciar contenedores detenidos
docker compose start

# Detener y eliminar contenedores (mantiene volúmenes)
docker compose down

# Detener, eliminar contenedores Y volúmenes (¡CUIDADO! Borra la DB)
docker compose down -v

# Ver logs en tiempo real
docker compose logs -f

# Reconstruir y reiniciar un servicio específico
docker compose up -d --build backend

# Ejecutar comandos dentro de un contenedor
docker compose exec backend sh
docker compose exec mongodb mongosh

# Ver uso de recursos
docker stats
```

---

## 🌐 Despliegue en Producción

### Opción 1: Railway.app (Recomendado - Gratuito)

Railway es una plataforma que soporta Docker nativamente y ofrece plan gratuito.

#### Preparación

1. **Crear cuenta en Railway**: https://railway.app/
2. **Instalar Railway CLI**:
```bash
npm install -g @railway/cli
railway login
```

#### Desplegar Backend

```bash
# Desde la raíz del proyecto
cd packages/backend

# Inicializar proyecto Railway
railway init

# Configurar variables de entorno en Railway Dashboard:
# - MONGO_URI (usar Railway MongoDB o Atlas)
# - JWT_SECRET
# - NODE_ENV=production
# - ALLOWED_ORIGINS=https://tu-frontend.vercel.app

# Desplegar
railway up
```

#### Desplegar Frontend (Vercel)

Vercel puede usar el Dockerfile o hacer build directamente:

```bash
# Opción 1: Build tradicional (más simple)
cd packages/frontend
vercel --prod

# Opción 2: Con Docker (avanzado)
# Configurar vercel.json para usar Docker
vercel --prod --docker
```

### Opción 2: Render.com (Dockerfile Nativo)

#### Backend en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. New → Web Service
3. Conecta tu repositorio
4. Configuración:
   - **Root Directory**: `packages/backend`
   - **Environment**: Docker
   - **Dockerfile Path**: `packages/backend/Dockerfile`
   - Variables de entorno: igual que antes

#### Frontend en Render

1. New → Static Site o Web Service
2. Si usas Web Service:
   - **Root Directory**: `packages/frontend`
   - **Environment**: Docker
   - **Dockerfile Path**: `packages/frontend/Dockerfile`

### Opción 3: Fly.io (Especializado en Contenedores)

```bash
# Instalar Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Desplegar backend
cd packages/backend
fly launch
fly deploy

# Desplegar frontend
cd packages/frontend
fly launch
fly deploy
```

### Opción 4: AWS ECS / Google Cloud Run / Azure Container Instances

Para estas plataformas necesitarás:

1. **Subir imágenes a un registry**:
```bash
# Docker Hub
docker tag tp-backend:latest tuusuario/tp-backend:latest
docker push tuusuario/tp-backend:latest

# Amazon ECR / Google Container Registry
# (requiere configuración específica de cada proveedor)
```

2. **Configurar el servicio** en la plataforma respectiva
3. **Configurar variables de entorno**
4. **Configurar red y balanceo de carga**

---

## 🔄 CI/CD Pipeline

### GitHub Actions con Docker

Crea `.github/workflows/docker-ci-cd.yml`:

```yaml
name: Docker CI/CD

on:
  push:
    branches: [ main, lucas_m_despliegue ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd packages/backend
          npm ci
      
      - name: Run tests
        run: |
          cd packages/backend
          npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push Backend
        uses: docker/build-push-action@v4
        with:
          context: ./packages/backend
          push: true
          tags: tuusuario/tp-backend:latest
      
      - name: Build and push Frontend
        uses: docker/build-push-action@v4
        with:
          context: ./packages/frontend
          push: true
          tags: tuusuario/tp-frontend:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Aquí iría el script de deploy a tu plataforma
          echo "Deploying to production..."
```

### Flujo CI/CD Completo

```
┌─────────────┐
│  Developer  │
│  Git Push   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  CI: Continuous Integration         │
│  ┌────────────────────────────────┐ │
│  │ 1. Checkout código             │ │
│  │ 2. Instalar dependencias       │ │
│  │ 3. Ejecutar tests              │ │
│  │ 4. Chequeos de seguridad       │ │
│  │ 5. Linting / Code quality      │ │
│  └────────────────────────────────┘ │
└──────────────┬──────────────────────┘
               │ ✅ Tests PASS
               ▼
┌─────────────────────────────────────┐
│  Build: Construcción de Artefactos  │
│  ┌────────────────────────────────┐ │
│  │ 1. Build Docker images         │ │
│  │ 2. Push to registry (DockerHub)│ │
│  │ 3. Tag con versión semántica   │ │
│  └────────────────────────────────┘ │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  CD: Continuous Deployment          │
│  ┌────────────────────────────────┐ │
│  │ 1. Pull latest images          │ │
│  │ 2. Deploy según estrategia     │ │
│  │    (Blue-Green/Canary/Rolling) │ │
│  │ 3. Health checks               │ │
│  │ 4. Notificaciones              │ │
│  └────────────────────────────────┘ │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌──────────────┐
        │  PRODUCCIÓN  │
        └──────────────┘
```

---

## 📊 Estrategias de Deployment

### 1. Recreate (La que estamos usando por defecto)

```yaml
# docker-compose.yml - Configuración actual
# Al hacer "docker compose down && docker compose up" se recrean todos los contenedores
```

**Características:**
- ✅ **Downtime**: Sí (breve)
- ✅ **Rollback**: Difícil
- ✅ **Complejidad**: Baja
- ✅ **Costo**: Bajo
- ✅ **Ideal para**: Desarrollo, entornos de prueba

### 2. Rolling Deployment

Actualiza contenedores uno por uno:

```bash
# Actualizar backend sin downtime
docker compose up -d --no-deps --scale backend=2 --no-recreate backend
docker compose up -d --no-deps --scale backend=1 backend
```

**Características:**
- ✅ **Downtime**: Mínimo
- ✅ **Rollback**: Medio
- ✅ **Complejidad**: Media
- ✅ **Costo**: Bajo
- ✅ **Ideal para**: Producción con múltiples instancias

### 3. Blue-Green Deployment

Mantén dos ambientes completos:

```yaml
# docker-compose-blue.yml (versión actual)
services:
  backend-blue:
    image: backend:v1.0.0
    # ...

# docker-compose-green.yml (versión nueva)
services:
  backend-green:
    image: backend:v1.1.0
    # ...
```

```bash
# Levantar green
docker compose -f docker-compose-green.yml up -d

# Cambiar tráfico (usando un load balancer como Nginx)
# ...

# Bajar blue
docker compose -f docker-compose-blue.yml down
```

**Características:**
- ✅ **Downtime**: No
- ✅ **Rollback**: Muy fácil (cambiar tráfico de vuelta)
- ✅ **Complejidad**: Media
- ✅ **Costo**: Alto (duplica recursos)
- ✅ **Ideal para**: Alta disponibilidad, releases frecuentes

### 4. Canary Deployment

Deploy gradual con % de tráfico:

```bash
# Requiere load balancer configurado
# 10% tráfico a v2, 90% a v1
# Luego 50%-50%
# Finalmente 100% a v2
```

**Características:**
- ✅ **Downtime**: No
- ✅ **Rollback**: Fácil
- ✅ **Complejidad**: Alta
- ✅ **Costo**: Medio
- ✅ **Ideal para**: Servicios críticos, pruebas graduales

---

## 🔍 Troubleshooting

### Contenedor no inicia

```bash
# Ver logs detallados
docker compose logs backend

# Verificar que el contenedor no está en conflicto
docker ps -a | grep tp-

# Eliminar contenedores antiguos
docker compose down
docker compose up -d
```

### Puerto ya en uso

```bash
# Ver qué está usando el puerto 3000
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000

# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # host:container
```

### MongoDB no conecta

```bash
# Verificar que MongoDB está corriendo
docker compose ps mongodb

# Ver logs de MongoDB
docker compose logs mongodb

# Conectarse manualmente
docker compose exec mongodb mongosh -u admin -p admin123
```

### Build lento o falla

```bash
# Limpiar caché de Docker
docker builder prune

# Rebuild sin caché
docker compose build --no-cache

# Ver espacio en disco
docker system df

# Limpiar todo (¡CUIDADO!)
docker system prune -a --volumes
```

### Error de permisos (Linux)

```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar
newgrp docker
```

### Contenedor se reinicia constantemente

```bash
# Ver logs completos
docker compose logs --tail=100 backend

# Verificar health check
docker compose ps

# Entrar al contenedor para debug
docker compose exec backend sh
```

---

## 📚 Recursos y Referencias

### Documentación Oficial
- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

### Tutoriales Recomendados
- [Docker para Principiantes (FreeCodeCamp)](https://www.freecodecamp.org/espanol/news/guia-de-docker-para-principiantes-como-crear-tu-primera-aplicacion-docker/)
- [The Docker Handbook](https://www.freecodecamp.org/news/the-docker-handbook/)
- [Learn CI/CD](https://www.freecodecamp.org/news/learn-continuous-integration-delivery-and-deployment/)

### Herramientas Útiles
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Cliente GUI para MongoDB
- [Portainer](https://www.portainer.io/) - UI para gestionar contenedores Docker

---

## 🎯 Checklist de Deployment

- [ ] Docker y Docker Compose instalados
- [ ] Variables de entorno configuradas
- [ ] Imágenes construidas exitosamente
- [ ] Contenedores iniciados (docker compose up -d)
- [ ] MongoDB conectado y funcionando
- [ ] Backend responde en /api/health
- [ ] Frontend accesible en http://localhost
- [ ] Tests pasando (23/23)
- [ ] Logs sin errores
- [ ] Volúmenes configurados para persistencia

---

**Última actualización:** Noviembre 2025  
**Mantenido por:** Equipo Desarrollo - Grupo 02
