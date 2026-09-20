#!/bin/bash
BIN=$1

mkdir "build"
mkdir "build/patcher"
mkdir "build/shuffler"

rm -f build/patcher/extraction.json

pushd lib/BIN-Patcher
mkdir "build"
node bins/sotn-us/util extract -b "$BIN" -o "build/extraction.json"
node bins/sotn-us/util dependencies -t "bins/sotn-us/data/change-dependencies-template.json" -o "build/change-dependencies.json"
popd

mv "lib/BIN-Patcher/build/extraction.json" "build/patcher/extraction.json"
mv "lib/BIN-Patcher/build/change-dependencies.json" "build/patcher/change-dependencies.json"
