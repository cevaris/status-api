# Status API backend
---
## Status API

Local Dev

    tsc --watch -p backend
    ./scripts/dev.sh api

Deploy

    ./scripts/deploy.sh api

Logs

`gcloud app logs tail -s api`

Web

- https://status-api-dev.wl.r.appspot.com
- https://status-api-dev.wl.r.appspot.com/reports/aws:us-east-2:s3:upload.json
- https://runner-dot-status-api-dev.wl.r.appspot.com/monitor/last_written.json


API

- http://localhost:8080/report_metadata.json?q=s3
- http://localhost:8080/report_metadata/aws:us-east-2:s3:upload.json
- http://localhost:8080/reports/aws:us-east-2:s3:upload.json
- http://localhost:8080/reports/aws:us-east-2:s3:upload.json?latest_failures=10
- http://localhost:8080/reports/failures.json
- http://localhost:8080/stream/reports/failures.json?start_date=2020-10-13T13:59:50.762Z

---
## Status Runner
Runs status reports - Node/Typescript

Development:

    tsc --watch -p backend
    ./scripts/dev.sh runner

Deploy:

    ./scripts/deploy.sh runner

Logs

`gcloud app logs tail -s runner`


Web

https://runner-dot-status-api-dev.wl.r.appspot.com


### Indexes

https://cloud.google.com/datastore/docs/tools/indexconfig

List indexes

`gcloud datastore indexes list`

Create index

`gcloud datastore indexes create index.yaml`

Remove indexes not in index.yaml

`gcloud datastore indexes cleanup index.yaml`

### Tests

    npm run test-integration


## Resources

- https://www.google.com/u/1/recaptcha/admin/site/433761601