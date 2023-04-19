#!/usr/bin/env bash
source "${BASH_SOURCE%/*}/.env"

# Get the current branch name
if [ -z "$BRANCH_NAME" ]; then
  BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
fi
export BRANCH_NAME=$BRANCH_NAME

# Exit if no branch name is provided
if [ -z "$BRANCH_NAME" ]; then
  echo "Branch name required"
  exit 1
fi

export IMAGE_NAME=$(jq -r .name package.json)
VERSION="v$(jq -r .version package.json)"
export NAME_AND_VERSION_TAG="$IMAGE_NAME:$VERSION"
