#!/usr/bin/env bash

ROOT_DIR=$(git rev-parse --show-toplevel)
cd $ROOT_DIR
trap "cd $ROOT_DIR" err exit

# tsc -p backend/
cd backend/
node ./dist/src/scripts/backfill.js $@
