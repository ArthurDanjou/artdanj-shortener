FROM node:15.8.0-alpine3.10

RUN mkdir -p /usr/src/artclick
WORKDIR /usr/src/artclick

COPY . /usr/src/artclick

RUN apk update && \
    apk add git

RUN yarn install

RUN yarn build

RUN cp .env build

WORKDIR /usr/src/artclick/build

RUN yarn install --production

EXPOSE 1012

CMD ["yarn", "start"]
