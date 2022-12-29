FROM node:16.16.0-alpine
WORKDIR /usr/app
EXPOSE 8055
COPY extensions /usr/app/extensions
COPY .env /usr/app/
COPY Dockerfile /usr/app/
COPY package.json /usr/app/
COPY package-lock.json /usr/app/
COPY README.md /usr/app/
RUN npm install
COPY ./files_to_replace/directus/dist/app.js /usr/app/node_modules/directus/dist/
CMD ["npx", "directus", "start"]