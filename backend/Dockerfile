FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "start:dev"]
