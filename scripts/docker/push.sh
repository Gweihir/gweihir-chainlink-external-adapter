#!/usr/bin/env bash
# Push docker image to AWS ECR
source "${BASH_SOURCE%/*}/variables.sh"

aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin $CONTAINER_REGISTRY

COMMAND="docker push $CONTAINER_REGISTRY/$NAME_AND_VERSION_TAG"
echo $COMMAND
eval $COMMAND

# Push latest if the branch is main
if [ "$BRANCH_NAME" == "main" ]; then
  COMMAND="docker push $CONTAINER_REGISTRY/$IMAGE_NAME:latest"
  echo $COMMAND
  eval $COMMAND
fi