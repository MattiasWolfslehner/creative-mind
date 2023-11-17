#!/bin/bash

mkdir -p data/ideas/csv

mvn clean package

mvn quarkus:dev
