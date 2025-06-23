FROM node:24-slim
WORKDIR /alert-processor
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node","main.js"]
