#!bin/bash

# start the backend
cd ./creative-mind-backend
bash ./start.sh &

cd ..

# start the fronend
cd ./frontend
bash ./start.sh &
