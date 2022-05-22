#!/usr/bin/env bash

# First run .ci/build.sh to build the image before release.

set -ex
source .ci/config.sh

scp ${SCP_PORT} $(pwd)/.ci/docker-compose.yml ${SSH_USER}@${SSH_HOST}:${BASE_DIRECTORY}${APP_NAME}/docker-compose.yml

docker save -o $(pwd)/${APP_NAME}.tar "${TARGET_IMAGE}:latest"

scp ${SCP_PORT} $(pwd)/${APP_NAME}.tar ${SSH_USER}@${SSH_HOST}:${BASE_DIRECTORY}${APP_NAME}.tar
rm -f $(pwd)/${APP_NAME}.tar

ssh ${SSH_PORT_OPT} ${SSH_USER}@${SSH_HOST} "docker rm -f ${APP_NAME} || true"
ssh ${SSH_PORT_OPT} ${SSH_USER}@${SSH_HOST} "docker load -i ${BASE_DIRECTORY}${APP_NAME}.tar"
ssh ${SSH_PORT_OPT} ${SSH_USER}@${SSH_HOST} "rm -f ${BASE_DIRECTORY}${APP_NAME}.tar"
ssh ${SSH_PORT_OPT} ${SSH_USER}@${SSH_HOST} "cd ${BASE_DIRECTORY}${APP_NAME} && docker-compose up --detach --build ${APP_NAME}"
