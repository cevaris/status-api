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

- failure_message: (string) empty if successful, shows API error details.
- latency_ms: (number) number of milliseconds it took to execute this report; end_date - start_date.
- start_date: (ISO 8601 UTC format) date time the report started.
- end_date: (ISO 8601 UTC format) date time the report was complete.
- success: (boolean) whether he report successfully completed (true) or failed to complete with an error (false).
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

## Streaming API 

Stream latest StatusAPI report failures; successful reports are not included.
```
curl -s 'https://api.status-api.com/stream/reports/failures.json'
```

If your stream gets disconnected, you can start streaming from a previous date by utilizing the `start_date` http parameter.
Note you can only replay up to 12 hours of data.
```
curl -s 'https://api.status-api.com/stream/reports/failures.json?start_date=2020-10-17T21:10:40.184Z'
```

Example Streaming StatusAPI report response [see report json above to learn about the fields](/docs#api-json-schema).
```
{
  "data": [
    {
      "failure_message": "Error: Report runner timed-out.",
      "latency_ms": 10002,
      "start_date": "2020-10-17T05:04:05.114Z",
      "end_date": "2020-10-17T05:04:15.116Z",
      "success": false,
      "key": "cloudflare:global:user:read"
    }
  ]
}
```

### Example Clients

**Python 3**
```
import requests

STREAM_URL = 'https://api.status-api.com/stream/reports/failures.json'

try:
    r = requests.get(STREAM_URL, stream=True)
    r.encoding = 'utf-8'

    for line in r.iter_lines(decode_unicode=True):
        if line:
            print(str(line))
except (requests.exceptions.ConnectionError, requests.exceptions.ConnectionError, requests.exceptions.ChunkedEncodingError):
    print('connection disconnected')
```

**Node/Javascript**
```
const https = require('https');

const StreamURL = 'https://api.status-api.com/stream/reports/failures.json';

https.get(StreamURL, function (res) {
    res.on('data', function (chunk) {
        process.stdout.write(chunk.toString());
    });
    res.on('end', function () {
        console.log('closed connection');
    });
});
```


## Historical API 

