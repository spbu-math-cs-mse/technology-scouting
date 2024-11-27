#!/bin/bash

set -e

DEV_DIR="$(cd $(dirname "$0") && pwd)"
PROJECT_DIR="$(dirname $DEV_DIR)"
echo "PROJECT_DIR=${PROJECT_DIR}"

# Update package lists
apt-get update

# Install required packages
apt-get install -y curl wget gnupg software-properties-common nginx

# Install Java JDK 21
echo "Installing OpenJDK 21..."
add-apt-repository ppa:openjdk-r/ppa -y
apt-get update
apt-get install -y openjdk-21-jdk

# Install Node.js (LTS version) and npm
echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash
apt-get install -y nodejs

# Install MongoDB 6.0
echo "Installing MongoDB 6.0..."

#Install MongoDB 6.0 Dependency
echo "deb http://security.ubuntu.com/ubuntu focal-security main" | tee /etc/apt/sources.list.d/focal-security.list
apt-get update
apt-get install libssl1.1
rm /etc/apt/sources.list.d/focal-security.list

wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org mongodb-org-shell
rm /etc/apt/sources.list.d/mongodb-org-6.0.list

