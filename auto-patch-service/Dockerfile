FROM node:24.4.0-alpine3.22
WORKDIR /auto-patch-programm
COPY package*.json ./
RUN npm install &&\
    npm cache clean --force &&\
    rm -rf /root/.npm &&\
    rm -rf node_modules
COPY . .
EXPOSE 13000
CMD ["npm","start"]
