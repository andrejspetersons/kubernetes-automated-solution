FROM node:24.4.0-alpine3.22
WORKDIR /api-programm
COPY package*.json ./
RUN npm install &&\
    npm cache clean --force &&\
    rm -rf /root/.npm &&\
    rm -rf node_modules
COPY . .
EXPOSE 11000
CMD ["npm","start"]
