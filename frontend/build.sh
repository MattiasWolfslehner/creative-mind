#!/usr/bin/env bash
set -e
npm install
npm run build
docker build --tag ghcr.io/mattiaswolfslehner/frontend:latest .
docker push ghcr.io/mattiaswolfslehner/frontend:latest
