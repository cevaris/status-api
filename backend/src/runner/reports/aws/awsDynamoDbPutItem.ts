import { AwsApi } from '.';
import { clients } from "../../clients";
import { Report } from '../report';


// Regions https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html

class AwsDynamoDBPutItem extends Report {

    constructor(region: AwsApi.Region) {
        super(AwsApi.Service, region, AwsApi.DynamoDB.Name, AwsApi.DynamoDB.Version, 'Put Item')
    }

    description(): string {
        return `Using version ${this.version}, asserts successful ${this.api} Put Item.`;
    }

    async run(): Promise<boolean> {
        const client = clients.dynamoDb(this);
        const nowTime = new Date().getTime();

        const params = {
            TableName: 'status-api',
            Item: {
                key: `report:${nowTime}`,
            }
        };
        const response = await client.put(params).promise();
        return true;
    }

}

export const AwsDynamoDBPutItemRunners: Array<Report> =
    AwsApi.Regions.map(region => {
        return new AwsDynamoDBPutItem(region);
    });