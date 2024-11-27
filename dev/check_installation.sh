#!/bin/bash

set -e

echo "==== java ===="
java -version

echo "==== npm ===="
npm --version

echo "==== nginx ===="
nginx -version

echo "==== mongod ===="
mongod --version

echo "==== mongosh ===="
mongosh --version
