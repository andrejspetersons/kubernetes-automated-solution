FROM node:lts-alpine3.23

WORKDIR /test_programme

COPY package*.json ./

RUN npm install &&\
    npm cache clean --force &&\
    rm -rf /root/.npm &&\
    rm -rf node_modules

COPY . .

EXPOSE 4000

USER root

CMD ["npm", "start"]