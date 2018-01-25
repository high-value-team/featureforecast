#!/bin/sh
source dropstack/environment.sh

rm -fr tmp.deployed.dropstack
mkdir tmp.deployed.dropstack
cp ../bin/*.* tmp.deployed.dropstack
cp dropstack/.dropstack.json tmp.deployed.dropstack
cp dropstack/Dockerfile tmp.deployed.dropstack

cd tmp.deployed.dropstack
dropstack deploy --compress --verbose --alias totalorder-backend.cloud.dropstack.run --type mono --stateful --token $DROPSTACK_TOKEN