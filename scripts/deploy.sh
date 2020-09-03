#!/usr/bin/env bash

ROOT_DIR=$(git rev-parse --show-toplevel)
cd $ROOT_DIR
trap "cd $ROOT_DIR" err exit

TARGET=$1

case $TARGET in
api)
    cd backend
    npm run build
    gcloud app deploy app.yaml
    ;;
app)
    cd app
    npm run deploy
    ;;
runner)
    cd backend
    npm run build
    gcloud app deploy runner.yaml
    ;;
all)
    echo 'y' | ${0} api
    echo 'y' | ${0} runner
    ${0} app
    ;;
*)
    echo 'Invalid deploy target {api|app|runner}'
    exit -1
    ;;
esac
