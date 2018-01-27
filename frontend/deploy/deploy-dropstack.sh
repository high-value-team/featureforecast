#!/bin/sh
source dropstack/environment.sh

rm -fr tmp.deployed.dropstack
mkdir tmp.deployed.dropstack
cp -r ../bin/ tmp.deployed.dropstack
cp dropstack/.dropstack.json tmp.deployed.dropstack
#cp dropstack/Dockerfile tmp.deployed.dropstack

cd tmp.deployed.dropstack
dropstack deploy --compress --verbose --alias featureforecast.cloud.dropstack.run --token $DROPSTACK_TOKEN
