#!/usr/bin/env bash
source "./${BASH_SOURCE%/*}/variables.sh"

set -e

if [ ! -z "$(git diff)" ]; then
  echo "There are uncommitted changes. Please commit or stash them before running this script."
  exit 1
fi

LATEST_TAG="$IMAGE_NAME:latest"

echo "Building docker image with tag '$LATEST_TAG'" 

COMMAND="docker build . -t $LATEST_TAG --platform linux/amd64 $@"

echo "Executing command: $COMMAND"

eval $COMMAND
