# StatusAPI Docs

## API JSON Schema

**Report JSON Schema**
```
{
  "failure_message": "Error: Report runner timed-out.",
  "latency_ms": 10002,
  "start_date": "2020-10-17T05:04:05.114Z",
  "end_date": "2020-10-17T05:04:15.116Z",
  "success": false,
  "key": "cloudflare:global:user:read",
  "type": "status_report"
}
```

- failure_message: (string?) empty if successful, returns API error details.
- latency_ms: (number) number of milliseconds it took to execute this report; end_date - start_date.
- start_date: (ISO 8601 UTC format) date time the report started.
- end_date: (ISO 8601 UTC format) date time the report was complete.
- success: (boolean) whether he report successfully and correctly completed (true) or failed to complete or was not correct (false).
- key: (string) identifier of this report in the following format `service:region:api:action`.
- type: (string) the type of this json object.

**Error JSON Schema**
```
{
  "error": {
    "code": 400,
    "message": "start_date '2020-10-18T15:50:01.dd' is invalid. Provide a valid ISO 8601 UTC format."
  }
}
```
- code: (number) error code categorizing this error.
- message: (string) human readable description of error.

## Firehose API 

Stream the latest StatusAPI reports.
A [socket.io](https://socket.io/) client is required.

Stream via HTML/JS; great for rendering realtime charts.
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Status Report Firehose</title>
</head>

<body>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.1/socket.io.js"></script>
    <script>
        const socket = io("https://api.status-api.com/reports/firehose");

        // listen for "status_report" events;
        socket.on("status_report", function (data) {
            console.log(data);
        });
        socket.on("exception", function (data) {
            console.error(data);
        });
    </script>
</body>

</html>
```

If your stream gets disconnected, you can start streaming from a previous date by utilizing the `start_date` http parameter.
Note you can only replay up to 1 hour of data.
```
const options = { query: { start_date: '2020-10-08T09:13:53.724Z' } };
const socket = io("https://api.status-api.com/reports/firehose", options);

socket.on("status_report", function (data) {
    console.log(data);
});
socket.on("exception", function (data) {
    console.error(data);
});
```

Example Firehose StatusAPI report response [see above to learn about each of the fields](/docs#api-json-schema).
```
{
  "data": [
    {
      "end_date": "2020-10-18T22:02:02.393Z",
      "key": "aws:us-west-1:sqs:receive_message",
      "latency_ms": 493,
      "start_date": "2020-10-18T22:02:01.900Z",
      "success": true,
      "type": "status_report"
    }
  ]
}
```

### Example Firehose Clients

**Python 3**
```
#!/usr/bin/env python
# pip install python-socketio
# https://python-socketio.readthedocs.io/en/latest/api.html

import socketio
import datetime

sio = socketio.Client()

# sending optional start_date parameter
now = datetime.datetime.utcnow()
socket_URL = f'https://api.status-api.com?start_date={now}'

sio.connect(socket_URL, namespaces=['/reports/firehose'])

@sio.event(namespace='/reports/firehose')
def status_report(data):
    print(data)

@sio.event(namespace='/reports/firehose')
def exception(data):
    print(data)
```

**Node/Javascript**
```
// npm install socket.io-client
// https://www.npmjs.com/package/socket.io-client
const io = require('socket.io-client');

// setting optional start_date parameter
const now = new Date();
const options = { query: `start_date=${now.toISOString()}` };

const socket = io('https://api.status-api.com/reports/firehose', options);

socket.on('status_report', (data) => {
    console.log(data);
});
socket.on('exception', (data) => {
    console.error(data);
});
```


## Historical API 

Query for historical minutely status reports.
Use the [Status API search](status-api.com/search) to discover the keys of the desired API.

**cURL Request**

Fetch the Cloudfare User Read API reports starting from 2020-10-08T08:13:53.427Z.
```
curl https://api.status-api.com/reports/cloudflare:global:user:read.json?start_date=2020-10-08T08:13:53.427Z
```
- start_date: (ISO 8601 date string) required. Returns 60 minutely reports starting at the provided start_date. To get the latest data, request with a start_date that is from 1 hour ago. start_date cannot be in the future.


**Report JSON Schema**

Example StatusAPI report response [see above to learn about each of the fields](/docs#api-json-schema).
```
{
  "data": [
    {
      "end_date": "2020-10-08T08:14:53.137Z",
      "key": "cloudflare:global:user:read",
      "latency_ms": 107,
      "start_date": "2020-10-08T08:14:53.030Z",
      "success": true,
      "type": "status_report"
    },
    {
      "end_date": "2020-10-08T08:15:53.724Z",
      "key": "cloudflare:global:user:read",
      "latency_ms": 117,
      "start_date": "2020-10-08T08:15:53.607Z",
      "success": true,
      "type": "status_report"
    },
    ...
    {
      "end_date": "2020-10-08T09:13:53.724Z",
      "key": "cloudflare:global:user:read",
      "latency_ms": 122,
      "start_date": "2020-10-08T09:13:53.133Z",
      "success": true,
      "type": "status_report"
    }
  ]
}
```