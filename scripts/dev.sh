#!/usr/bin/env bash

ROOT_DIR=$(git rev-parse --show-toplevel)
cd $ROOT_DIR
trap "cd $ROOT_DIR" err exit

TARGET=$1

case $TARGET in
api)
    cd backend
    npm run dev -- api
    ;;
app)
    cd app
    npm run dev
    ;;
runner)
    cd backend
    npm run dev -- runner
    ;;
*)
    echo 'Invalid dev target {api|app|runner}'
    exit -1
    ;;
esac
