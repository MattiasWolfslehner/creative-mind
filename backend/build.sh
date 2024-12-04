#!/usr/bin/env bash
set -e
mvn clean package
docker build --tag ghcr.io/mattiaswolfslehner/backend .
docker push ghcr.io/mattiaswolfslehner/backend
pushd keycloak
docker build --tag ghcr.io/mattiaswolfslehner/keycloak .
docker push ghcr.io/mattiaswolfslehner/keycloak
popd
