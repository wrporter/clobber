#!/usr/bin/env bash

set -e
source .ci/config.sh

docker rmi "${TARGET_IMAGE}:${VERSION}" >/dev/null 2>&1 || true
