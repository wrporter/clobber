###############################################################################
# Build Static Assets
###############################################################################
FROM alpine:3.9 AS static
LABEL maintainer="wesleyrporter@gmail.com"

RUN apk add --no-cache nodejs nodejs-npm

WORKDIR /src

COPY package*.json ./
RUN npm ci --loglevel=warn

COPY .babelrc webpack.config.js  ./
COPY src src
RUN npm run ci

###############################################################################
# Build Server
###############################################################################
FROM nginx:1.15-alpine AS server
LABEL maintainer="wesleyrporter@gmail.com"

RUN mkdir -p /var/log/clobber

COPY .ci/nginx.conf /etc/nginx/nginx.conf
COPY --from=static /src/dist /var/www
