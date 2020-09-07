import SQS from 'aws-sdk/clients/sqs';
import { AwsApi } from '.';
import { clients } from "../../clients";
import { Report } from '../report';

class AwsSqsReceiveMessage extends Report {
    messages: SQS.Message[] = [];

    constructor(region: AwsApi.Region) {
        super(AwsApi.Service, region, AwsApi.SQS.Name, AwsApi.SQS.Version, 'Receive Message')
    }

    description(): string {
        return `Using version ${this.version}, asserts no errors when calling receive message message.`;
    }

    async run(): Promise<boolean> {
        const client = clients.sqs(this);

        const params = {
            MaxNumberOfMessages: 10,
            QueueUrl: AwsApi.SQS.QueueURL,
            WaitTimeSeconds: 0
        };
        const response = await client.receiveMessage(params).promise();

        // delete old and new messages in cleanup
        if (response.Messages) {
            this.messages = response.Messages;
        }

        if (!response.$response?.requestId) {
            throw Error('receive missing requestId');
        }

        return true;
    }

    async cleanup(): Promise<void> {
        const client = clients.sqs(this);
        await Promise.all(this.messages.flatMap(m => this.deleteMessage(client, m)));
    }

    private async deleteMessage(client: SQS, message: SQS.Message): Promise<void> {
        if (!message.ReceiptHandle) return;

        var deleteParams = {
            QueueUrl: AwsApi.SQS.QueueURL,
            ReceiptHandle: message.ReceiptHandle
        };

        try {
            await client.deleteMessage(deleteParams).promise();
        } catch (error) {
            // do nothing
        }
    }
}

export const AwsSqsReceiveMessageRunners: Array<Report> =
    AwsApi.Regions.map(region => {
        return new AwsSqsReceiveMessage(region);
    });