#!/bin/bash

set -o errexit
cd $SCRIPTS_FOLDER

MONGO_URL=$(echo "$MONGO_URL" | MONGO_DATABASE="$APP_BASENAME" envsubst)
export MONGO_URL

# Poll until we can successfully connect to MongoDB
source ./connect-to-mongo.sh

echo 'Starting app...'
cd $APP_BUNDLE_FOLDER/bundle

exec "$@"