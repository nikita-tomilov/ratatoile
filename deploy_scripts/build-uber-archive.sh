#!/bin/bash
CLIENT_SOURCE_DIR="../client/build"
TBP_SOURCE_DIR="../table_booking_page"
SERVER_JAR="../server/target/server-0.0.1-SNAPSHOT.jar"

TARGET_DIR="/tmp/ratatoile-uberjar"
TARGET_STATIC_DIR="/tmp/ratatoile-uberjar/public"
TARGET_STATIC_SYSTEM_DIR="/tmp/ratatoile-uberjar/public/system"
TARGET_ARCHIVE="ratatoile-uberjar.zip"

rm -rf $TARGET_DIR
mkdir -p $TARGET_STATIC_SYSTEM_DIR

echo "Copying client"
cp -r $CLIENT_SOURCE_DIR/* $TARGET_STATIC_SYSTEM_DIR
mv $TARGET_STATIC_SYSTEM_DIR/static $TARGET_STATIC_DIR

echo "Copying TBP"
cp -r $TBP_SOURCE_DIR/* $TARGET_STATIC_DIR

echo "Copying server"
cp $SERVER_JAR $TARGET_DIR/

echo "Building archive"
cd $TARGET_DIR
zip $TARGET_ARCHIVE -r ./*
cd -

echo "Done"
