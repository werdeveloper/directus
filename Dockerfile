FROM node:16.16.0-alpine
WORKDIR /usr/app
EXPOSE 8055
COPY config /usr/app/config
COPY extensions /usr/app/extensions
COPY UM /usr/app/UM
COPY .env /usr/app/
COPY Dockerfile /usr/app/
COPY LICENSE /usr/app/
COPY package.json /usr/app/
COPY package-lock.json /usr/app/
COPY README.md /usr/app/
RUN npm install
COPY ./files_to_replace/directus/dist/middleware/authenticate.js /usr/app/node_modules/directus/dist/middleware/
COPY ./files_to_replace/directus/dist/middleware/respond.js /usr/app/node_modules/directus/dist/middleware/
COPY ./files_to_replace/directus/dist/services/authentication.js /usr/app/node_modules/directus/dist/services/
COPY ./files_to_replace/directus/dist/extensions.js /usr/app/node_modules/directus/dist/
COPY ./files_to_replace/directus/dist/app.js /usr/app/node_modules/directus/dist/
CMD ["npx", "directus", "start"]