import util from 'util';
import { s3 } from './aws';
import { dropbox } from './dropbox';
import { slack } from './slack';
import { stripeClient } from './stripe';
import { pagerduty } from './pagerduty';

export const clients = {
    dropbox: util.promisify(dropbox),
    pagerduty: pagerduty,
    s3: s3,
    slack: slack,
    stripe: stripeClient,
}