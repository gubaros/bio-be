# Usa una imagen de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Compila el proyecto TypeScript
RUN npm run build

# Expone el puerto
EXPOSE 3000

# Ejecuta el servidor
CMD ["node", "dist/app.js"]

