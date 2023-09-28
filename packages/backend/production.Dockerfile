FROM node:18.17.1-alpine As builder


# Définissez le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

COPY . .

RUN yarn

# Copiez le reste du code de l'application

RUN yarn build

# Exposez le port sur lequel l'application s'exécute
EXPOSE 443

# Définissez la commande pour exécuter l'application
CMD ["node", "dist/main"]