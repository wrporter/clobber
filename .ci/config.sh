#!/usr/bin/env bash

APP_NAME="clobber"

BASE_DIRECTORY="/volume1/docker/"
SSH_USER="wesp"
SSH_HOST="roshar"
DOCKER_REGISTRY="192.168.1.222:5555"

DOCKER_REGISTRY_URL="${DOCKER_REGISTRY:-}"
IMAGE_PATH="${IMAGE_PATH:-${APP_NAME}}"
TARGET_IMAGE="${DOCKER_REGISTRY_URL}/${IMAGE_PATH}"

VERSION="${GIT_COMMIT:-$(git rev-parse HEAD)}"

BUILD_ID=${BUILD_ID:="FAKE_ID_123"}

GIT_REPO_URL="${GIT_URL:-$(git remote get-url origin)}"
GIT_COMMIT=${GIT_COMMIT:-$(git rev-parse HEAD)}
GIT_AUTHOR_EMAIL=${GIT_AUTHOR_EMAIL:-$(git show -s --format="%ae" HEAD)}
GIT_BRANCH=${GIT_BRANCH:-"$(git rev-parse --abbrev-ref HEAD)"}
GIT_BRANCH_NAME=$(echo ${GIT_BRANCH} | rev | cut -d/ -f1 | rev)
