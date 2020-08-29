import stripe from 'stripe';
import { Config } from '../config';

const config: stripe.StripeConfig = { apiVersion: '2020-08-27' };
export const stripeClient = new stripe(Config.required('STRIPE_SECRET_KEY'), config);

