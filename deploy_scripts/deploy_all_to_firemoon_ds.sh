#!/bin/bash
SOURCE_DIR="/tmp/ratatoile-uberjar"
SOURCE_ARCHIVE_NAME="ratatoile-uberjar.zip"

TARGET_HOST=firemoon-server
TARGET_DIR=/home/hotaro/ratatoile_server_binary

echo "Step 1. UberJar"
./build-uber-archive.sh

SOURCE_ARCHIVE=$SOURCE_DIR/$SOURCE_ARCHIVE_NAME

echo "Step 2. Copying"
ssh $TARGET_HOST 'sudo -S supervisorctl stop Ratatoile'
echo "stopped"

ssh $TARGET_HOST 'rm -rf '$TARGET_DIR'/*.jar'
ssh $TARGET_HOST 'rm -rf '$TARGET_DIR'/public'
scp $SOURCE_ARCHIVE $TARGET_HOST:$TARGET_DIR
ssh $TARGET_HOST 'cd '$TARGET_DIR'; unzip '$SOURCE_ARCHIVE_NAME
echo "copied"

ssh $TARGET_HOST 'sudo -S supervisorctl start Ratatoile'
echo "started"