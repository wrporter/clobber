#!/usr/bin/env bash

set -e
source .ci/config.sh

docker run --rm --entrypoint="ls" ${TARGET_IMAGE}:${VERSION}

container_id=$(docker create ${TARGET_IMAGE}:${VERSION})

docker cp ${container_id}:/src/coverage $(pwd)/coverage

docker rm -v ${container_id}