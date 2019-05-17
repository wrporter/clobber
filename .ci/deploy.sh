#!/usr/bin/env bash

# First run .ci/build.sh to build the image before release.

set -e
source .ci/config.sh

docker save -o $(pwd)/${APP_NAME}.tar "${TARGET_IMAGE}:latest"

scp $(pwd)/${APP_NAME}.tar x-wing:/home/x-wing/www/${APP_NAME}
rm -f $(pwd)/${APP_NAME}.tar

ssh x-wing "docker rm -f ${APP_NAME}"
ssh x-wing "docker load -i /home/x-wing/www/${APP_NAME}/${APP_NAME}.tar"
ssh x-wing "rm -f /home/x-wing/www/${APP_NAME}/${APP_NAME}.tar"
ssh x-wing "cd /home/x-wing/www/caddy && docker-compose up --detach --build ${APP_NAME}"
