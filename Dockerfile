FROM node:10-alpine

WORKDIR /odoo_api

COPY . .

EXPOSE 9000

RUN apk update
RUN apk upgrade
RUN apk add --no-cache git
RUN apk add --no-cache openssh

RUN npm install
RUN npm install --quiet node-gyp -g
RUN rm -rf ./lib

RUN npm install lerna -g

RUN lerna bootstrap
RUN yarn build
