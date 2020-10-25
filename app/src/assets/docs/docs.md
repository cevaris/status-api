# StatusAPI Docs

Note, these endpoints are heavily rate limited and are for demo purposes only.
We are in the process of developing a subscription offering for those who are interested.

## Schemas

**Report JSON Schema**

A Report contains data from a single API call, that is collected every minute, which contains data whether that API call succeeded or failed.

```
{
  "failure_message": "HTTPError: Response code 503 (Service Unavailable)",
  "latency_ms": 5107,
  "start_date": "2020-10-17T05:04:05.114Z",
  "end_date": "2020-10-17T05:04:15.116Z",
  "success": false,
  "key": "cloudflare:global:user:read",
  "type": "status_report"
}
```

- key: (string) identifier or name of this Report, which is the following format `service:region:api:action`.
- success: (boolean) whether the Report successfully and correctly completed (true) or failed to complete or was not correct (false).
- failure_message: (string?): not sent if Report response was successful & correct, contains API response details if Report failed.
- latency_ms: (number) number of milliseconds it took to execute this Report (end_date - start_date).
- start_date: (ISO 8601 UTC format) date time the Report started.
- end_date: (ISO 8601 UTC format) date time the Report completed.
- type: (string) the type of this json object.

**Status API Error JSON Schema**

In the case clients make an invalid request to StatusAPI or StatusAPI API fails, errors will be returned in the following format.

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

<br/><hr/><br/>

## Firehose API

Stream the latest StatusAPI Reports.
Great for storing 100% the data for offline, repeated use.
A <a href="https://socket.io" target="_blank">socket.io</a> client is required. 
Note, due to Google App Engine restrictions, the socket.io connection will always fallback to long-polling. 

**Stream via HTML/JS** 

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

        // listen for "status_report" events
        socket.on("status_report", function (data) {
            console.log(data);
        });
        // any server errors will emitted to "exception"
        socket.on("exception", function (data) {
            console.error(data);
        });
    </script>
</body>

</html>
```

If your stream gets disconnected, you can start streaming from a previous date by utilizing the `start_date` http parameter (non-inclusive).
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

Example Firehose StatusAPI Report response [see above to learn about each of the fields](/docs#schemas).

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

# setting optional start_date parameter
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

<br/><hr/><br/>

## Historical API

Query for historical minutely status reports. Great for rendering realtime charts. 
You can use the <a href="https://status-api.com/search" target="_blank">Status API search</a> tool to discover the keys of the desired Report. 

**cURL Request**

Ex. fetch the Cloudfare User Read API reports starting from 2020-10-08T08:13:53.427Z.

```
curl https://api.status-api.com/reports/cloudflare:global:user:read.json?start_date=2020-10-08T08:13:53.427Z
```

- start_date: (ISO 8601 UTC format) Required. Returns 60 minutely Reports starting at the provided `start_date` (non-inclusive). To get the latest data, request with a `start_date` that is from 1 hour ago. `start_date` cannot be in the future.

**Report JSON Schema**

Example StatusAPI Report response. [See above to learn about each of the fields](/docs#schemas).

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
