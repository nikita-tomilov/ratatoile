#!/bin/bash
cd client/
npm run build
cd ..
./restart_apache.sh
echo "Done"
