#!/usr/bin/env bash

set -e
source .ci/config.sh

container_id=$(docker create ${TARGET_IMAGE}:${VERSION})
docker cp ${container_id}:/src/coverage $(pwd)/coverage
docker rm -v ${container_id}
