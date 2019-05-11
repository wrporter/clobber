#!/usr/bin/env bash

set -e
source .ci/config.sh

docker tag ${TARGET_IMAGE}:${VERSION} ${TARGET_IMAGE}:latest
docker push ${TARGET_IMAGE}:${VERSION}
docker push ${TARGET_IMAGE}:latest
