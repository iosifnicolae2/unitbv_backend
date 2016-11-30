#!/bin/bash

PROJECT_NAME="unitbv"

cd mongodb_docker
./build.sh $PROJECT_NAME
cd ../

cd nginx_docker
./build.sh $PROJECT_NAME
cd ../

cd reddis_docker
./build.sh $PROJECT_NAME
cd ../

cd static_html
./build.sh $PROJECT_NAME
cd ../

