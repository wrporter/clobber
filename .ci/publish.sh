#!/usr/bin/env bash

# First run .ci/build.sh to build the image before publish.

set -e
source .ci/config.sh

docker push "${TARGET_IMAGE}:latest"
