#!/bin/bash

set -e

source "$(dirname "$0")/prepare_env.sh"

cd "${PROJECT_DIR}/backend"
echo "Starting backend service..."
# Ensure executable permissions for Gradle wrapper
chmod +x gradlew
# Build the backend
./gradlew build
# Run the backend
./gradlew run