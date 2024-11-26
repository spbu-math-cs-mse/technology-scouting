#!/bin/bash

DEV_DIR="$(cd $(dirname "$0") && pwd)"
echo "DEV_DIR=${DEV_DIR}"
export PROJECT_DIR="$(dirname $DEV_DIR)"
echo "PROJECT_DIR=${PROJECT_DIR}"

# Load environment variables from .env file
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
else
    echo "No .env file found in $PROJECT_DIR"
    exit 1
fi

# Print values for debugging (optional)
echo "MONGODB_HOST=$MONGODB_HOST"
echo "MONGODB_PORT=$MONGODB_PORT"
echo "MONGODB_USERNAME=$MONGODB_USERNAME"
echo "MONGODB_PASSWORD=$MONGODB_PASSWORD"
echo "MONGODB_DBNAME=$MONGODB_DBNAME"
echo "BOT_TOKEN=$BOT_TOKEN"
