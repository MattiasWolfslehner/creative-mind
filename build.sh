#!/usr/bin/env bash
set -e
pushd frontend
npm install
npm run build
docker build --tag frontend .
popd

pushd backend
./build.sh
popd
