#!/bin/bash

# start the backend
cd ./backend
bash ./start.sh &

cd ..

# start the fronend
cd ./frontend
bash ./start.sh &
