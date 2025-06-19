FROM node:lts-alpine3.21
WORKDIR /auto-patch-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["node","cronjob.js"]
