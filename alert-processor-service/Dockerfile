FROM node:24.4.0-alpine3.22
ENV MODE=start
WORKDIR /alert-processor
COPY package*.json ./
RUN npm install &&\
    npm cache clean --force &&\
    rm -rf /root/.npm &&\
    rm -rf node_modules
COPY . .
EXPOSE 3000
CMD ["sh","-c","npm run ${MODE}"]
