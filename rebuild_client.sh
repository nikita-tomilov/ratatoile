#!/bin/bash
cd client/
rm -rf build
npm run build
echo "Build is available in ./client/build"