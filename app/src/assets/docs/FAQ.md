# FAQ (Frequently Asked Question)

<img style="float: right; margin: 10px;" src="/assets/media/but-why.jpg" width="200"/>

## Why?
Companies depend on an API to be working reliably; ex. email, databases, payment API's. 
Having trusted 3rd-Party collected metrics on a single dashboard is critical.
Most large API SaaS companies provide some high level status page that is manually updated, and allows the SaaS company to hide minor (but critical) outages or not API status updates quick enough.
Futhermore, these generic status pages may not have the granularity needed to determine if there is really an issue with one of their APIs or not.


<img style="float: right; margin: 10px;" src="/assets/media/tell-me-how.jpg" width="200" height="170"/>

## How?
Currently, StatusAPI has a background process executing each API every minute and storing the results.
There is a chance that sub-minute failures could occur without being recorded.
Each API request is using the API's official, or recommended, open source client.
All requests occur within Google App Engine's us-west2 region.
Not all API endpoints are collected, rather critical, well known APIs were chosen first and the number of monitored API's will continue to grow over time.


## Can't I just track this data myself?
Yes, you can. Though many companies outsource metrics gathering or require technical resources/expertise to manage such infrastructure. 
What if your metrics infrastructure is down, or what if you want to compare the reliability and/or performance between two API's? 
Having a centralized, trusted 3rd-Party source provides clear data to determine if a specific API is "down" or compare/contrast between API's.


<img style="float: right; margin: 10px;" src="/assets/media/fire-hydrant.jpg" width="200"/>

## Can I have access to historical data?
Yes, StatusAPI provides API access for both historical and realtime data. See [/docs](/docs).