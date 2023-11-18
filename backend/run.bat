@echo off

rem http://${host}:${restPort}/api/ideas/${roomId}/download/csv
mkdir data\ideas\csv

mvnw compile quarkus:dev
