import AWS from 'aws-sdk';
import { Config } from '../../common/config';
import { Report } from '../reports/report';


// Docs
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

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