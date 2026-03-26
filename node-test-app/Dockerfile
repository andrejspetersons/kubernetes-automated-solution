ARG NODE_VERSION=lts-alpine3.22

FROM node:${NODE_VERSION}
LABEL base_node_version=${NODE_VERSION}

WORKDIR /test_programme

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]