#!/bin/bash

# remove node_moduels -> if there
rm -rf ./node_modules

# install npm-packages and start dev-server
npm i --no-audit && npm start
