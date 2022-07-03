FROM node:16-alpine3.11

RUN mkdir -p /usr/src/shortener
WORKDIR /usr/src/shortener

COPY . /usr/src/shortener

RUN apk update && \
    apk add git

RUN yarn install

RUN yarn build

RUN cp .env build

WORKDIR /usr/src/shortener/build

RUN yarn install --production

EXPOSE 1012

CMD ["yarn", "start"]
