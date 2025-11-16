# Stage 1: Build de la aplicación React
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar todas las dependencias (incluidas devDependencies para el build)
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Stage 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar el build de React al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada de Nginx (para React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Nginx se inicia automáticamente con la imagen
CMD ["nginx", "-g", "daemon off;"]
