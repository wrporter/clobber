#!/usr/bin/env bash

set -e
source .ci/config.sh

docker build \
	--file .ci/Dockerfile \
	--target static \
	--tag "${TARGET_IMAGE}:${VERSION}" \
	--tag "${TARGET_IMAGE}:latest" \
	.
