#!/usr/bin/env bash
set -e
pushd frontend
npm install
npm run build
docker build --tag ghcr.io/mattiaswolfslehner/frontend .
docker push ghcr.io/mattiaswolfslehner/frontend
popd

pushd backend
./build.sh
popd
