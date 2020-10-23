#!/bin/bash
PID=0
trap func SIGTERM SIGINT
function func() {
	kill $PID
	wait $PID
}
cd /opt1/ratatoile
java -cp /opt1/ratatoile/ -jar /opt1/ratatoile/server-0.0.1-SNAPSHOT.jar &
PID=$!
wait $PID