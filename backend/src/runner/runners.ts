import { AwsDynamoDBPutItemRunners } from './reports/aws/awsDynamoDbPutItem';
import { AwsS3Runners } from './reports/aws/awsS3Upload';
import { AwsSqsReceiveMessageRunners } from './reports/aws/awsSqsReceiveMessage';
import { AwsSqsSendMessageRunners } from './reports/aws/awsSqsSendMessage';
import { CloudflareIPsReadRunners } from './reports/cloudflare/ipsRead';
import { CloudflareUserReadRunners } from './reports/cloudflare/userRead';
import { CloudflareZonesReadRunners } from './reports/cloudflare/zonesList';
import { DigitalOceanAccountGetRunners } from './reports/digitalOcean/accountGet';
import { DropboxFilesListRunners } from './reports/dropboxV2/filesListFolder';
import { DropboxV2FileUploadRunners as DropboxFileUploadRunners } from './reports/dropboxV2/filesUpload';
import { DropboxV2UsersGetAccountRunners as DropboxUsersGetAccountRunners } from './reports/dropboxV2/usersGetAccount';
import { DropboxV2UsersGetCurrentAccountRunners as DropboxUsersGetCurrentAccountRunners } from './reports/dropboxV2/usersGetCurrentAccount';
import { ErrorRandomThrowRunner } from './reports/error/randomThrow';
import { ErrorThrowReportRunner } from './reports/error/throw';
import { ErrorTimeoutReportRunner } from './reports/error/timeout';
import { GithubUserGetAuthenticatedRunners } from './reports/github/userGetAuthenticated';
import { GithubUserUpdateAuthenticatedRunners } from './reports/github/userUpdateAuthenticated';
import { PagerdutyCreateIncidentRunners } from './reports/pagerduty/createIncidents';
import { PagerdutyListIncidentsRunners } from './reports/pagerduty/listIncidents';
import { Report } from './reports/report';
import { SlackCallsAddRunners } from './reports/slack/callsAdd';
import { ChatPostMessageRunners as SlackChatPostMessageRunners } from './reports/slack/chatPostMessage';
import { SlackConversationHistoryRunners } from './reports/slack/conversationsHistory';
import { SlackConversationsSetTopicRunners } from './reports/slack/conversationsSetTopic';
import { SlackFilesUploadRunners } from './reports/slack/filesUpload';
import { StripeCustomerCreateReportRunners } from './reports/stripe/stripeCustomersCreate';

export const reportFuncRunners: Array<Report> = new Array<Report>()
  // debug
  .concat(ErrorRandomThrowRunner)
  .concat(ErrorThrowReportRunner)
  .concat(ErrorTimeoutReportRunner)
  // live
  .concat(AwsDynamoDBPutItemRunners)
  .concat(AwsS3Runners)
  .concat(AwsSqsReceiveMessageRunners)
  .concat(AwsSqsSendMessageRunners)
  .concat(CloudflareIPsReadRunners)
  .concat(CloudflareUserReadRunners)
  .concat(CloudflareZonesReadRunners)
  .concat(DigitalOceanAccountGetRunners)
  .concat(DropboxFilesListRunners)
  .concat(DropboxFileUploadRunners)
  .concat(DropboxUsersGetAccountRunners)
  .concat(DropboxUsersGetCurrentAccountRunners)
  .concat(GithubUserGetAuthenticatedRunners)
  .concat(GithubUserUpdateAuthenticatedRunners)
  .concat(PagerdutyCreateIncidentRunners)
  .concat(PagerdutyListIncidentsRunners)
  .concat(SlackCallsAddRunners)
  .concat(SlackChatPostMessageRunners)
  .concat(SlackConversationHistoryRunners)
  .concat(SlackConversationsSetTopicRunners)
  .concat(SlackFilesUploadRunners)
  .concat(StripeCustomerCreateReportRunners);
