#!/usr/bin/env bash

ROOT_DIR=$(git rev-parse --show-toplevel)
cd $ROOT_DIR
trap "cd $ROOT_DIR" err exit

TARGET=$1

case $TARGET in
api)
    cd backend
    npm run build
    echo 'y' | gcloud app deploy app.yaml
    ;;
app)
    Message="Better hurry with that new disk...  One partition is $space % full."
    cd app
    npm run deploy
    ;;
runner)
    Message="Start thinking about cleaning out some stuff.  There's a partition that is $space % full."
    cd backend
    npm run build
    echo 'y' | gcloud app deploy runner.yaml
    ;;
*)
    echo 'Invalid deploy target {api|app|runner}'
    exit -1
    ;;
esac
