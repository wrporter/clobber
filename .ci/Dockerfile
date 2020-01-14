###############################################################################
# Build Static Assets
###############################################################################
FROM alpine:3.11 AS static
LABEL maintainer="wesleyrporter@gmail.com"

RUN apk add --no-cache nodejs nodejs-npm

WORKDIR /src

COPY package*.json ./
RUN npm ci --loglevel=warn

COPY webpack.config.js .eslintrc.yml ./
COPY src src
RUN npm run ci

###############################################################################
# Build Server
###############################################################################
FROM abiosoft/caddy AS server
LABEL maintainer="wesleyrporter@gmail.com"

RUN mkdir -p /var/log/clobber

COPY .ci/Caddyfile /etc/Caddyfile
COPY --from=static /src/dist /srv
