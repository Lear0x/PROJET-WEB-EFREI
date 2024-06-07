# Utiliser l'image Node.js comme base
FROM node:latest AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Construire l'application Vue.js
RUN npm run build

# Étape de production
FROM nginx:latest

# Copier le build de l'étape de construction précédente dans le répertoire de déploiement Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80 pour accéder à l'application via HTTP
EXPOSE 80

# Démarrer le serveur Nginx
CMD ["nginx", "-g", "daemon off;"]
