import util from 'util';
import { dynamoDb, s3, sqs } from './aws';
import { cf as cloudflare } from './cloudflare';
import { digitalOcean } from './digitalOcean';
import { dropbox } from './dropbox';
import { github } from './github';
import { pagerduty } from './pagerduty';
import { slack } from './slack';
import { stripeClient } from './stripe';

export const clients = {
    cloudflare: cloudflare,
    dropbox: util.promisify(dropbox),
    digitalOcean: digitalOcean,
    dynamoDb: dynamoDb,
    github: github,
    pagerduty: pagerduty,
    s3: s3,
    slack: slack,
    sqs: sqs,
    stripe: stripeClient,
}