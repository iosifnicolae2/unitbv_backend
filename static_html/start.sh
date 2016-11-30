#! /bin/bash
  docker rm -f "$1"
docker run --name $1 --link $2:mongodb$4 --link $3:reddis$4 -i -d  -v /unitbv_app/static_html/:/server -t app$4:latest 





