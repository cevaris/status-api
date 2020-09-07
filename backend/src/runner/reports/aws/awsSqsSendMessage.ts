import SQS from 'aws-sdk/clients/sqs';
import { AwsApi } from '.';
import { clients } from "../../clients";
import { Report } from '../report';


// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sqs-examples-send-receive-messages.html
class AwsSqsSendMessage extends Report {
    static QueueURL: string = "https://sqs.us-east-1.amazonaws.com/755892755226/StatusAPI.fifo";

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
            QueueUrl: AwsSqsSendMessage.QueueURL
        };

        // Send message
        const response: SQS.SendMessageResult = await client.sendMessage(sendParams).promise();
        if (!response.MessageId) {
            throw new Error('SQS send message response missing MessageId field');
        }

        const receiveParams = {
            MaxNumberOfMessages: 10,
            QueueUrl: AwsSqsSendMessage.QueueURL,
            WaitTimeSeconds: 0
        };
        const receiveResponse = await client.receiveMessage(receiveParams).promise();

        // delete old and new messages
        if (receiveResponse.Messages) {
            await Promise.all(receiveResponse.Messages.flatMap(m => this.deleteMessage(client, m)));
        }

        return true;
    }

    private async deleteMessage(client: SQS, message: SQS.Message): Promise<void> {
        if (!message.ReceiptHandle) return;

        var deleteParams = {
            QueueUrl: AwsSqsSendMessage.QueueURL,
            ReceiptHandle: message.ReceiptHandle
        };

        try {
            await client.deleteMessage(deleteParams).promise();
        } catch (error) {
            console.error(error);
            // do nothing
        }
    }

}

export const AwsSqsSendMessageRunners: Array<Report> =
    AwsApi.Regions.map(region => {
        return new AwsSqsSendMessage(region);
    });