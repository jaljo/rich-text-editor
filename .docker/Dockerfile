FROM node:16.7-alpine as dev

WORKDIR /app
RUN chown 1000:1000 /app

RUN apk add --no-cache curl

USER 1000

CMD ["yarn"]
