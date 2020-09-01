import util from 'util';
import { s3 } from './aws';
import { dropbox } from './dropbox';
import { slack } from './slack';
import { stripeClient } from './stripe';

export const clients = {
    dropbox: util.promisify(dropbox),
    s3: s3,
    stripe: stripeClient,
    slack: slack
}