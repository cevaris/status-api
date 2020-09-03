import { AwsS3Runners } from "./reports/aws/awsS3Upload";
import { CloudflareUserReadRunners } from "./reports/cloudflare/userRead";
import { CloudflareZonesReadRunners } from "./reports/cloudflare/zonesList";
import { DropboxV2FileUploadRunners } from "./reports/dropboxV2/filesUpload";
import { DropboxV2UsersGetAccountRunners } from "./reports/dropboxV2/usersGetAccount";
import { DropboxV2UsersGetCurrentAccountRunners } from "./reports/dropboxV2/usersGetCurrentAccount";
import { ErrorRandomThrowRunner } from "./reports/error/randomThrow";
import { ErrorThrowReportRunner } from "./reports/error/throw";
import { ErrorTimeoutReportRunner } from "./reports/error/timeout";
import { PagerdutyCreateIncidentRunners } from "./reports/pagerduty/createIncidents";
import { PagerdutyListIncidentsRunners } from "./reports/pagerduty/listIncidents";
import { Report } from "./reports/report";
import { ChatPostMessageRunners as SlackChatPostMessageRunners } from "./reports/slack/chatPostMessage";
import { StripeCustomerCreateReportRunners } from "./reports/stripe/stripeCustomersCreate";


export const reportFuncRunners: Array<Report> = new Array<Report>()
    .concat(AwsS3Runners)
    .concat(CloudflareUserReadRunners)
    .concat(CloudflareZonesReadRunners)
    .concat(DropboxV2FileUploadRunners)
    .concat(DropboxV2UsersGetAccountRunners)
    .concat(DropboxV2UsersGetCurrentAccountRunners)
    .concat(ErrorRandomThrowRunner)
    .concat(ErrorThrowReportRunner)
    .concat(ErrorTimeoutReportRunner)
    .concat(PagerdutyCreateIncidentRunners)
    .concat(PagerdutyListIncidentsRunners)
    .concat(SlackChatPostMessageRunners)
    .concat(StripeCustomerCreateReportRunners)
    ;
