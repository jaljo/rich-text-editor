FROM node:9.11.2-alpine as dev

WORKDIR /app
RUN chown 1000:1000 /app

USER 1000

CMD ["yarn"]

RUN yarn install
