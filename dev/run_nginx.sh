#!/bin/bash

set -e

source "$(dirname "$0")/prepare_env.sh"


# Function to start the frontend
start_frontend() {
  echo "Starting frontend service..."
  cd frontend
  # Install dependencies
  npm install
  # Build the frontend
  npm run build
  # Start the frontend
  npm start &
  FRONTEND_PID=$!
  cd ..
}

echo "Starting nginx service..."
NGINX_CONF="/tmp/nginx.conf"
rm -rf $NGINX_CONF

# Preparing local nginx config:
echo "events {}" >$NGINX_CONF
echo "http {" >>$NGINX_CONF
cat "${PROJECT_DIR}/nginx/nginx.conf" >>$NGINX_CONF
echo "}" >>$NGINX_CONF
# sed -i 's/listen 80/listen 81/g' $NGINX_CONF
sed -i 's/backend/localhost/g' $NGINX_CONF
sed -i 's/frontend/localhost/g' $NGINX_CONF

echo "Config:"
cat $NGINX_CONF

nginx -tc $NGINX_CONF 
echo "Starting nginx"
nginx -c $NGINX_CONF -g "daemon off;"
