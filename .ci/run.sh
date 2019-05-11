#!/usr/bin/env bash

source .ci/config.sh

docker run \
	--rm \
	--name=clobber \
	-p 80:80 \
	-p 443:443 \
    -v `pwd`/tls:/etc/pki/tls \
    -v `pwd`/logs:/var/log/ui-docs \
	${TARGET_IMAGE}:${VERSION}
