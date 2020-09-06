import AWS from 'aws-sdk';
import { Config } from '../../common/config';
import { Report } from '../reports/report';


// Docs
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

// Regions
// https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html

const config = {
    credentials: {
        accessKeyId: Config.AWS_ACCESS_KEY_ID,
        secretAccessKey: Config.AWS_SECRET_ACCESS_KEY
    }
}
AWS.config.update(config);

export const s3 = (runnerConfig: Report): AWS.S3 => {
    return new AWS.S3({ apiVersion: runnerConfig.version, region: runnerConfig.region });
}

export const dynamoDb = (runnerConfig: Report): AWS.DynamoDB.DocumentClient => {
    return new AWS.DynamoDB.DocumentClient({ apiVersion: runnerConfig.version, region: runnerConfig.region });
}