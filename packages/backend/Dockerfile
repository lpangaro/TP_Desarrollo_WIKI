# Usar imagen oficial de Node.js LTS (Long Term Support)
FROM node:18-alpine

# Establecer directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que corre el servidor
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
