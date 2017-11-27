#!/bin/bash

docker-compose -f docker-compose.debug.yml up --force-recreate -d
docker-compose ps
