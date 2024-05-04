#!/bin/bash

kubectl apply -f postgres.yaml || echo "Couldn't start DB, please ensure that minikube is running" >&2 && exit

kubectl get pods ##(podname von postgres-xxxxx-yy)-- derzeit  postgres-6bf68995d9-phfrg
kubectl port-forward $(kubectl get pods | grep --perl-regex -o '(post\S+)') 5432:5432 -n default

