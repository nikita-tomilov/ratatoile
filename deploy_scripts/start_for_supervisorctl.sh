#!/bin/bash
PID=0
DIR=/home/hotaro/ratatoile_server_binary
trap func SIGTERM SIGINT
function func() {
        kill $PID
        wait $PID
}
cd $DIR
java -cp /home/hotaro/ratatoile_server_binary -jar /home/hotaro/ratatoile_server_binary/server-0.0.1-SNAPSHOT.jar &
PID=$!
wait $PID