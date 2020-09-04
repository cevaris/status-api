import util from 'util';
import { s3 } from './aws';
import { cf as cloudflare } from './cloudflare';
import { dropbox } from './dropbox';
import { github } from './github';
import { pagerduty } from './pagerduty';
import { slack } from './slack';
import { stripeClient } from './stripe';

export const clients = {
    cloudflare: cloudflare,
    dropbox: util.promisify(dropbox),
    github: github,
    pagerduty: pagerduty,
    s3: s3,
    slack: slack,
    stripe: stripeClient,
}