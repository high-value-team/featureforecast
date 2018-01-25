#!/bin/sh
rm -fr tmp.deployed.locally
mkdir tmp.deployed.locally
mkdir tmp.deployed.locally/db
cp ../bin/*.* tmp.deployed.locally
cp locally/run.sh tmp.deployed.locally

cd tmp.deployed.locally
./run.sh