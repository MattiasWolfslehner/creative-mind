#!/bin/bash

kubectl apply -f postgres.yaml || echo "Couldn't start DB, please ensure that minikube is running" >&2
