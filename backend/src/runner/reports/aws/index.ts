import { DynamoDB } from "aws-sdk";

export module AwsApi {
    export const Service = 'AWS'

    export enum Region {
        UsWest1 = 'us-west-1',
        UsWest2 = 'us-west-2',
        UsEast1 = 'us-east-1',
        UsEast2 = 'us-east-2',
    }

    export const Regions = Object.values(AwsApi.Region);

    export module S3 {
        export const Name = 'S3';
        export const Version = '2006-03-01';
    }

    export module DynamoDB {
        export const Name = 'DynamoDB';
        export const Version = '2012-08-10';
    }

    export module SQS {
        export const Name = 'SQS';
        export const Version = '2012-11-05';
        export const QueueURL = "https://sqs.us-east-1.amazonaws.com/755892755226/StatusAPI.fifo";
    }
}