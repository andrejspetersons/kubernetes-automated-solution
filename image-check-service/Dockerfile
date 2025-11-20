FROM node:lts-alpine3.21
WORKDIR /image-check-service
COPY package*.json ./
RUN npm install &&\
    npm cache clean --force &&\
    rm -rf /root/.npm &&\
    rm -rf node_modules
COPY . .
EXPOSE 12000
CMD ["npm","start"]
