#!/usr/bin/env bash

set -e
source .ci/config.sh

docker build \
	--file .ci/Dockerfile \
	--tag "${TARGET_IMAGE}:${VERSION}" \
	docs
