#!/usr/bin/env bash

set -e
source .ci/config.sh

docker build \
	--file .ci/Dockerfile \
  --label "app.build-info.service-name=${APP_NAME}" \
  --label "app.build-info.build-time=${CURRENT_TIMESTAMP}" \
  --label "app.build-info.git-branch=${GIT_BRANCH_NAME}" \
  --label "app.build-info.git-commit=${GIT_COMMIT}" \
  --label "app.build-info.git-repo=${GIT_REPO_URL}" \
  --label "app.build-info.git-user-email=${GIT_AUTHOR_EMAIL}" \
	--tag "${TARGET_IMAGE}:${VERSION}" \
	--tag "${TARGET_IMAGE}:latest" \
	.
