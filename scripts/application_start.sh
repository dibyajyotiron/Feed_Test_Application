#!/bin/bash
# Stop all servers and start the server
sudo pkill -9 node
sudo service mongod restart
cd /home/ubuntu/feed_backend_node
npm run prod