#!/usr/bin/env bash

source .ci/config.sh

docker run \
	--rm \
	--name=clobber \
	-p 2015:2015 \
	${TARGET_IMAGE}:${VERSION}
