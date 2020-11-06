# Postgre on Helios guide

1 Init database
```
s207219@helios:/home/s207219/ratatoile$ cat init_postgre.sh
#!/bin/bash
DBPATH=/home/s207219/ratatoile/db
initdb -D $DBPATH
```

2 Change password
```
s207219@helios:/home/s207219/ratatoile$ vim db/postgresql.conf
```
under "listen address" or something set
```
port = 13979
```

3 Start database
```
s207219@helios:/home/s207219/ratatoile$ cat start_postgre.sh 
#!/bin/bash
DBPATH=/home/s207219/ratatoile/db
pg_ctl -D $DBPATH -l logfile start
```

4 Create user and db for ratatoile
```
s207219@helios:/home/s207219/ratatoile$ psql  -p 13979 postgres  
psql (9.6.1)
Type "help" for help.
```
Type in commands from ```dockered_databases/containers/postgre/init.sql```

5 Stop database when not needed

```
s207219@helios:/home/s207219/ratatoile$ cat stop_postgre.sh 
#!/bin/bash
DBPATH=/home/s207219/ratatoile/db
pg_ctl -D $DBPATH stop
```

# JMeter on Helios guide

1 Download same version on both Helios and locally

2 Start JMeter Server on helios
```
s207219@helios:/home/s207219/ratatoile$ cat jmeter-server-start.sh 
#!/bin/bash
set -x
java -jar /home/s207219/tools/apache-jmeter-5.3/bin/ApacheJMeter.jar \
   -Dserver_port=24000 \
   -Djava.rmi.server.hostname=127.0.0.1 \
   -Dserver.rmi.localhostname=127.0.0.1 \
   -Dserver.rmi.localport=26000 \
   -Jserver.rmi.ssl.disable=true \
   -s # -j jmeter-server.logs
```
3 Perform port forwarding (note: without the port that Ratatoile Tomcat is listening at)
```
$ ssh -L 24000:127.0.0.1:24000 -R 25000:127.0.0.1:25000 -R 25001:127.0.0.1:25001 -R 25002:127.0.0.1:25002  -L 26000:127.0.0.1:26000 helios
```
4 Start JMeter Client on local machine
```
$ cat ./jmeter-client-start.sh 
#!/bin/bash
set -x
java -jar /opt/apache-jmeter-5.3/bin/ApacheJMeter.jar \
   -Dremote_hosts=127.0.0.1:24000 \
   -Dclient_port=25000 \
   -Djava.rmi.server.hostname=127.0.0.1 \
   -Dserver.rmi.localhostname=127.0.0.1 \
   -Dclient.rmi.localhostname=127.0.0.1 \
   -Dclient.rmi.localport=25000 \
   -Dclient.rmi.callbackport=25000 \
   -Jserver.rmi.ssl.disable=true
```
You may also need to specify remote_hosts in ```/opt/apache-jmeter-5.3/bin/jmeter.properties``` as well

For some reason, even though I specify port 25000, it listens at 25001 and 25002 and idk why
```
$ sudo netstat -tlnupaon | grep java
tcp6       0      0 :::25001                :::*                    LISTEN      7859/java            off (0.00/0/0)
tcp6       0      0 :::25002                :::*                    LISTEN      7859/java            off (0.00/0/0)
tcp6       0      0 127.0.0.1:41822         127.0.0.1:26000         ESTABLISHED 7859/java            keepalive (7193,07/0/0)
tcp6       0      0 127.0.0.1:34810         127.0.0.1:24000         ESTABLISHED 7859/java            keepalive (7193,04/0/0)
```
5 In JMeter Client, open the test scenario file

6 Simple "Start" will yield 100% errors - no port forwarding established -> connection refused

7 Remote "Start" at 127.0.0.1:24000 will be OK, it will perform requests from helios to helios and send the samples back to you