#!/usr/bin/env bash
set -e
mvn clean package
docker build --tag backend .
pushd keycloak
docker build --tag keycloak .
popd
