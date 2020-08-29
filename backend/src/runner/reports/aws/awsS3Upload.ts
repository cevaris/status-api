import { S3 } from 'aws-sdk';
import { AwsApi } from '.';
import { clients } from "../../clients";
import { Report } from '../report';


// Regions https://docs.aws.amazon.com/general/latest/gr/s3.html

class AwsS3UploadConfig extends Report {

    constructor(region: AwsApi.Region) {
        super(AwsApi.Service, region, AwsApi.S3.Name, AwsApi.S3.Version, 'Upload')
    }

    description(): string {
        return `Using version ${this.version}, asserts successful ${this.api} file upload.`;
    }

    async run(): Promise<boolean> {
        const client = clients.s3(this);
        const nowTime = new Date().getTime();
        const filename = `${nowTime}.txt`;

        const bucket = `status.api.${this.region}`
        const request: S3.PutObjectRequest = {
            Bucket: `status.api.${this.region}`,
            Key: filename,
            Body: 'example txt content'
        }
        const response = await client.upload(request).promise();
        return bucket === response.Bucket;
    }

}

const awsRegions = Object.values(AwsApi.Region);

export const AwsS3Runners: Array<Report> =
    awsRegions.map(region => {
        return new AwsS3UploadConfig(region);
    });