import stripe from 'stripe';
import { Config } from '../../common/config';

const config: stripe.StripeConfig = { apiVersion: '2020-08-27' };
export const stripeClient = new stripe(Config.STRIPE_SECRET_KEY, config);

