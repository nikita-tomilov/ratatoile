#!/bin/bash
psql -U postgres -h 192.168.0.149 -p 5432 -d ratatoile_database < ratatoile-db-dump.sqltxt
