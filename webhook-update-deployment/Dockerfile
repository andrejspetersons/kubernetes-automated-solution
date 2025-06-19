FROM node:23-slim
WORKDIR /auto-update-deployment-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 10000
CMD ["node","main.js"]
