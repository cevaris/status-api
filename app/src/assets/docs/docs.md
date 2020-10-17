# StatusAPI Docs

## Report JSON 
```
{
  "latencyMs": 10002,
  "isDebug": false,
  "message": "Error: Report runner timed-out.",
  "startDate": "2020-10-17T05:04:05.114Z",
  "endDate": "2020-10-17T05:04:15.116Z",
  "ok": false,
  "name": "cloudflare:global:user:read"
}
```

- startDate: (ISO 8601 UTC format) date time the report started.
- endDate: (ISO 8601 UTC format) date time the report was complete.
- isDebug: (boolean) marks whether this report is used for development only (true) or production (false).
- latencyMS: (number) number of milliseconds it took to execute this report; endDate - startDate.
- name: (string) identifier of this report in the following format `service:region:api:action`.
- ok: (boolean) whether he report successfully completed (true) or failed to complete with an error (false).

## Streaming API 

Stream latest StatusAPI report failures.
```
curl -s 'https://api.status-api.com/stream/reports/failures.json'
```

If your stream gets disconnected, you can start streaming from a previous date by utilizing the `start_date` http parameter.
Note you can only replay up to 12 hours of data.
```
curl -s 'https://api.status-api.com/stream/reports/failures.json?start_date=2020-10-17T21:10:40.184Z'
```

Example StatusAPI report streaming response [see report json above to learn about the fields](/docs#report-json).
```
{
  "report": {
    "latencyMs": 10002,
    "isDebug": false,
    "message": "Error: Report runner timed-out.",
    "startDate": "2020-10-17T05:04:05.114Z",
    "endDate": "2020-10-17T05:04:15.116Z",
    "ok": false,
    "name": "cloudflare:global:user:read"
    }
}
```

###
Example Clients

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
import https from 'https';

const StreamURL = 'https://api.status-api.com/stream/reports/failures.json';

https.get(StreamURL, function (res) {
    res.on('data', function (chunk: Buffer) {
        process.stdout.write(chunk.toString());
    });
    res.on('end', function () {
        console.log('closed connection');
    });
});
```


## Historical API 
