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
