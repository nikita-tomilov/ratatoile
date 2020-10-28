#!/bin/bash
SOURCE_DIR="../client/build"
TARGET_DIR="/home/hotaro/ratatoile/client/build"
SOURCE_ARCHIVE="/tmp/ratatoile-client.tgz"
TARGET_ARCHIVE="ratatoile-client.tgz"
tar czf $SOURCE_ARCHIVE $SOURCE_DIR
scp $SOURCE_ARCHIVE firemoon-server:/tmp/$TARGET_ARCHIVE
ssh firemoon-server 'rm -rf '$TARGET_DIR'/*; cd /tmp; tar xvf '$TARGET_ARCHIVE' ; mv /tmp/client/build/* '$TARGET_DIR '; rm -rf /tmp/client'