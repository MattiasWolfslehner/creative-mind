#!/bin/bash

# start the backend
cd ./backend
./start.sh &

cd ..

# start the fronend
cd ./frontend
./start.sh &

wait
