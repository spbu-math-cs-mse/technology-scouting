#!/bin/bash

set -e

source "$(dirname "$0")/prepare_env.sh"

echo "Starting frontend service..."
cd "${PROJECT_DIR}/frontend"
# Install dependencies
npm install
# Start the frontend
npm start 