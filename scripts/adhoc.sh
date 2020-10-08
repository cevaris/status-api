#!/usr/bin/env bash

ROOT_DIR=$(git rev-parse --show-toplevel)
cd $ROOT_DIR
trap "cd $ROOT_DIR" err exit

TARGET=$1

# tsc -p backend/
cd backend/
ts-node ./dist/runner/adhoc.js $TARGET
