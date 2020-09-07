import SQS from 'aws-sdk/clients/sqs';
import { AwsApi } from '.';
import { clients } from "../../clients";
import { Report } from '../report';


// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sqs-examples-send-receive-messages.html
class AwsSqsSendMessage extends Report {
    constructor(region: AwsApi.Region) {
        super(AwsApi.Service, region, AwsApi.SQS.Name, AwsApi.SQS.Version, 'Send Message')
    }

    description(): string {
        return `Using version ${this.version}, asserts successful ${this.api} Send Message.`;
    }

    async run(): Promise<boolean> {
        const client = clients.sqs(this);
        const nowTime = new Date().getTime();

        var sendParams = {
            MessageBody: `Ping ${nowTime}`,
            MessageGroupId: "Group1",
            QueueUrl: AwsApi.SQS.QueueURL
        };

        // Send message
        const response: SQS.SendMessageResult = await client.sendMessage(sendParams).promise();
        if (!response.MessageId) {
            throw new Error('SQS send message response missing MessageId field');
        }

        return true;
    }
}

export const AwsSqsSendMessageRunners: Array<Report> =
    AwsApi.Regions.map(region => {
        return new AwsSqsSendMessage(region);
    });