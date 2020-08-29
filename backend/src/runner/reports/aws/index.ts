export module AwsApi {
    export const Service = 'AWS'

    export enum Region {
        UsWest1 = 'us-west-1',
        UsWest2 = 'us-west-2',
        UsEast1 = 'us-east-1',
        UsEast2 = 'us-east-2',
    }

    export module S3 {
        export const Name = 'S3';
        export const Version = '2006-03-01';
    }
}



