# Status API backend
---
## Status API

Local Dev

`tsc --watch`
`npm run dev`


Deploy

`npm run deploy`


Logs

`gcloud app logs tail -s api`

Web

https://status-api-dev.wl.r.appspot.com
https://status-api-dev.wl.r.appspot.com/reports/aws:us-east-2:s3:upload.json


API

http://localhost:8080/reports/aws:us-east-2:s3:upload.json
http://localhost:8080/report_metadata.json
http://localhost:8080/report_metadata.json?q=s3
http://localhost:8080/report_metadata/aws:us-east-2:s3:upload.json

---
## Status Runner
Runs status reports - Node/Typescript

Development:

`npm run dev`

Deploy:

`gcloud app deploy runner.yaml`

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