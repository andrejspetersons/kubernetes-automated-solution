# Use official Node.js LTS image
FROM node:lts-jod

WORKDIR /test_programme

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]