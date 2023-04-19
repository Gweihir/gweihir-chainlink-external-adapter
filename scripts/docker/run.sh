#!/usr/bin/env bash
# Should be run in the project root
source "${BASH_SOURCE%/*}/variables.sh"

TAG="$IMAGE_NAME:latest"

echo "Running docker image '$TAG'" 

# Add `--env-file=.env` if wanting to use custom environment variables
COMMAND="docker run -it --rm --name gweihir-ea -p 4242:4242 $TAG $@"

echo "Executing command: $COMMAND"

eval $COMMAND