FROM node:15.8.0-alpine3.10

RUN mkdir -p /usr/src/linkyjs
WORKDIR /usr/src/linkyjs

COPY . /usr/src/linkyjs

RUN apk update && \
    apk add git

RUN yarn install

RUN yarn build

RUN cp .env build

WORKDIR /usr/src/linkyjs/build

RUN yarn install --production

EXPOSE 1012

CMD ["yarn", "start"]
