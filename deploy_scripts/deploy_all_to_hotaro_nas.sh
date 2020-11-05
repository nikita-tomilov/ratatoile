#!/bin/bash
SOURCE_DIR="/tmp/ratatoile-uberjar"
SOURCE_ARCHIVE_NAME="ratatoile-uberjar.zip"

TARGET_HOST=hotaro-nas
TARGET_DIR=/opt1/ratatoile/

echo "Step 1. UberJar"
./build-uber-archive.sh

SOURCE_ARCHIVE=$SOURCE_DIR/$SOURCE_ARCHIVE_NAME

echo "Step 2. Copying"
curl 'http://192.168.0.149:9228/index.html?processname=Ratatoile&action=stop' 2>/dev/null 1>/dev/null
echo "stopped"

ssh $TARGET_HOST 'rm -rf '$TARGET_DIR'/*.jar'
ssh $TARGET_HOST 'rm -rf '$TARGET_DIR'/public'
scp $SOURCE_ARCHIVE $TARGET_HOST:$TARGET_DIR
ssh $TARGET_HOST 'cd '$TARGET_DIR'; unzip '$SOURCE_ARCHIVE_NAME
echo "copied"

curl 'http://192.168.0.149:9228/index.html?processname=Ratatoile&action=start' 2>/dev/null 1>/dev/null
echo "started"
