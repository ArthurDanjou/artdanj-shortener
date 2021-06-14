FROM node:15.8.0-alpine3.10

RUN mkdir -p /usr/src/linky
WORKDIR /usr/src/linky

COPY . /usr/src/linky

RUN apk update && \
    apk add git

RUN yarn install

RUN yarn build

RUN cp .env build

WORKDIR /usr/src/linky/build

RUN yarn install --production

EXPOSE 1012

CMD ["yarn", "start"]
