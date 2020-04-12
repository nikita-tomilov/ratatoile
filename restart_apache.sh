#!/bin/bash
docker stop ratatoile_apache
docker rm ratatoile_apache
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
docker run -dit  --name ratatoile_apache --network host -v "$DIR/client/build":/usr/local/apache2/htdocs_system:Z -v "$DIR/table_booking_page/":/usr/local/apache2/htdocs/ -v "$DIR/custom-httpd.conf":/usr/local/apache2/conf/httpd.conf httpd:2.4

