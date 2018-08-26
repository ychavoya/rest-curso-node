FROM node:alpine

EXPOSE 8080

RUN apk add --update python && apk add build-base

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

CMD npm start