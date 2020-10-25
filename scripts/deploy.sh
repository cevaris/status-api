#!/usr/bin/env bash

ROOT_DIR=$(git rev-parse --show-toplevel)
cd $ROOT_DIR
trap "cd $ROOT_DIR" err exit

TARGET=$1

case $TARGET in
api)
    cd backend
    npm run build
    # need to use beta; https://stackoverflow.com/a/62580944/3538289
    echo 'y' | gcloud beta app deploy app.yaml

    # https://cloud.google.com/run/docs/quickstarts/build-and-deploy
    # gcloud builds submit --tag gcr.io/status-api-dev/backend-api
    # gcloud run deploy backend-api --image gcr.io/status-api-dev/backend-api --platform gke --region us-west1 --timeout=200

    # https://cloud.google.com/kubernetes-engine/docs/quickstarts/deploying-a-language-specific-app#node.js

    ;;
app)
    cd app
    npm run deploy
    ;;
runner)
    cd backend
    npm run build
    echo 'y' | gcloud app deploy runner.yaml
    ;;
all)
    ${0} api
    ${0} runner
    ${0} app
    ;;
*)
    echo 'Invalid deploy target {api|app|runner}'
    exit -1
    ;;
esac
