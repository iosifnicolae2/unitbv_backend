#!/bin/sh
  docker rm -f "$1"

docker run --name $1 \
--link $MONGO_INSTANCE:mongodb_inst \
--link $REDIS_INSTANCE:redis_inst \
--link $NODE_INSTANCE_STATIC:unitbv \
-i -d -p 9080:80 -p 9043:443  -v /unitbv_app/nginx_docker/sites-enabled:/etc/nginx/conf.d/ -v /unitbv_app/static_html/:/server  -d nginx_app$3 




#--link $NODE_INSTANCE:node_inst \
#--link $NODE_INSTANCE_STATIC2:node_static2 \
#--link $NODE_INSTANCE_STATIC3:node_static3 \
#--link $NODE_MAILO:node_mailo \


#docker run --name $1 -v /devart/nginx_docker/sites-enabled:/etc/nginx/conf.d/ -d nginx_app

