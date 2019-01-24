FROM node:9.11.2-alpine as dev

WORKDIR /app
RUN chown 1000:1000 /app

# hadolint ignore=DL3018
RUN apk add --no-cache curl

USER 1000

CMD ["yarn"]

################################################################################

FROM dev as prod

ENV GENERATE_SOURCEMAP=false

COPY --chown=1000:1000 package.json package.json
COPY --chown=1000:1000 yarn.lock yarn.lock

RUN yarn install

ARG ENV_FILE

COPY --chown=1000:1000 ${ENV_FILE} .env
COPY --chown=1000:1000 public/ public/
COPY --chown=1000:1000 src/ src/

RUN yarn run build

################################################################################

FROM nginx:1.15.1-alpine as nginx

RUN rm /etc/nginx/conf.d/default.conf

# hadolint ignore=DL3018
RUN apk add --no-cache curl

COPY --from=prod /app/build /app/build
COPY .docker/app/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

HEALTHCHECK --interval=10s --timeout=1s --retries=3 CMD \
    curl --fail --silent http://localhost/_status
