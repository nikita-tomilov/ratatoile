#!/bin/bash
mvn clean install -U -DskipTests
echo "Build is available in ./server/target"