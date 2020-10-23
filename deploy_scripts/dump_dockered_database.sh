#!/bin/bash
pg_dump 'postgresql://server_user:ERVb95UQhjV7pBnKUxHCe9nrqRrq7tGQ@localhost/ratatoile_database' > ratatoile-db-dump.sqltxt
echo "done"
