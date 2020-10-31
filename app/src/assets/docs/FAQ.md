# FAQ (Frequently Asked Questions)

<img style="float: right; margin: 10px;" src="/assets/media/but-why.jpg" alt="but why" width="200"/>

## Why?

3rd-Party APIs are critical to a company's operations; ex. email, databases, payment API's, making access to trusted 3rd-Party metrics critical as well.
During an incident, having access to 3rd-Party API is key to providing realtime communications to your customers.


Most large API SaaS companies provide some high-level status page that is manually and/or slowly updated.
Some transient issues may not even be reported at all, or the status web page is updated too slow.
Futhermore, these generic status pages may not have the granularity needed to determine if there is really an issue or not.
Official incident reports are often too vague such as <a href="https://www.githubstatus.com/incidents/5t09j5cly2sk?utm_ts=1604091876">"Degraded performance for API Requests"</a>.

StatusAPI provides realtime, API statuses, *including specific regions*, to help provide critical API status insight.

<img style="float: right; margin: 10px;" src="/assets/media/tell-me-how.jpg" alt="tell me how" width="200" height="170"/>

## How?

Access to trusted 3rd-Party metrics is key.
Currently, StatusAPI has a background process executing each API every minute and saving the results.
All StatusAPI Reports are executed within Google App Engine's us-west2 region.
Not all API endpoints are collected, rather critical, well known APIs were chosen first.
The number of monitored API's will continue to grow over time.

## Can't I just track this data myself?

Yes, you can. Though many companies outsource metrics gathering or require technical resources/expertise to manage such infrastructure.
What if your metrics infrastructure is down, or what if you want to compare the reliability and/or performance between two API's?
Having a centralized, trusted 3rd-Party source provides clear data to determine if a specific API is truly "down" or not.

<img style="float: right; margin: 10px;" src="/assets/media/fire-hydrant.jpg" alt="fire hydrant" width="200"/>

## Can I have access to StatusAPI Report data?

Soon!
StatusAPI provides API access to both **historical** and a realtime **firehose**.
These APIs are currently heavily rate limited and are for demo purposes only.
For more info about these APIs, see <a href="/docs" target="_blank">/docs</a>.
If you are really interested alpha access, please <a href="mailto:adam@status-api.com?subject=StatusAPI: Contact us">Contact Us</a>.

## Where are these gifs coming from?

Media is from&nbsp;<a href="https://giphy.com/" target="_blank">GIPHY</a>.
