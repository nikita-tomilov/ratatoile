#!/bin/bash
curl 'http://192.168.0.149:9228/index.html?processname=Ratatoile&action=stop' 2>/dev/null 1>/dev/null
echo "stopped"
scp ../server/target/server-0.0.1-SNAPSHOT.jar hotaro-nas:/opt1/ratatoile/
echo "copied"
curl 'http://192.168.0.149:9228/index.html?processname=Ratatoile&action=start' 2>/dev/null 1>/dev/null
echo "started"
