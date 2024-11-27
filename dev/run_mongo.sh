#!/bin/bash

set -e

source "$(dirname "$0")/prepare_env.sh"

# Set default values if environment variables are not provided
DB_PATH=${DB_PATH:-"/tmp/mongodb"}
echo "DB_PATH=${DB_PATH}"

# Ensure the data directory exists
if [ ! -d "$DB_PATH" ]; then
  echo "Creating database path at $DB_PATH"
  mkdir -p "$DB_PATH"
  if [ $? -ne 0 ]; then
    echo "Error: Failed to create database path."
    exit 1
  fi
fi

# Function to stop MongoDB gracefully
function cleanup {
  echo "Stopping MongoDB..."
  mongod --dbpath "$DB_PATH" --shutdown
  echo "MongoDB stopped."
}

# Trap to clean up when the script exits
trap cleanup EXIT

# Start MongoDB in the background
echo "Starting MongoDB with dbpath: $DB_PATH and port: $MONGODB_PORT"
mongod --dbpath "$DB_PATH" --port "$MONGODB_PORT" --fork --logpath "$DB_PATH/mongod.log"
if [ $? -ne 0 ]; then
  echo "Error: Failed to start MongoDB."
  exit 1
fi

# Wait a moment to ensure the server starts
sleep 5

# Connect to MongoDB and create the default database
echo "Creating default database: $MONGODB_DBNAME"
mongosh --port "$MONGODB_PORT" --eval "use $MONGODB_DBNAME" > /dev/null
if [ $? -eq 0 ]; then
  echo "Database '$MONGODB_DBNAME' created successfully."
else
  echo "Error: Failed to create database '$MONGODB_DBNAME'."
  exit 1
fi

echo "MongoDB is running. Press Ctrl+C to stop and exit."

# Tail MongoDB logs to keep the script running and display logs
tail -f "$DB_PATH/mongod.log"