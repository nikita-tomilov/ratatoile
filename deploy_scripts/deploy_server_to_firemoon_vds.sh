#!/bin/bash
ssh firemoon-server 'sudo -S supervisorctl stop Ratatoile'
echo "stopped"
scp ../server/target/server-0.0.1-SNAPSHOT.jar firemoon-server:/home/hotaro/ratatoile_server_binary
echo "copied"
ssh firemoon-server 'sudo -S supervisorctl start Ratatoile'
echo "started"
