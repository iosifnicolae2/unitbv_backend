#! /bin/bash

docker rm --force "$1"

docker run --name $1  -d -v /unitbv_app/mongodb_docker/data/db/:/data/db -v /unitbv_app/mongodb_docker/conf/mongo.conf:/etc/mongo.conf -v /unitbv_app/mongodb_docker/log/:/server/log/  mongo





