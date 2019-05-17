#!/usr/bin/env bash

set -e
source .ci/config.sh

docker push ${TARGET_IMAGE}:${VERSION}
docker push ${TARGET_IMAGE}:latest
