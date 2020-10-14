import Stripe from "stripe";
import { clients } from "../runner/clients";

// update Config env path
// node backend/dist/src/scripts/cleanupStripeCustomers.js

let totalNumOfDeleted = 0;

async function loop(cursor?: string): Promise<void> {
    const customers: Stripe.ApiList<Stripe.Customer> =
        await clients.stripe.customers.list({ limit: 25, starting_after: cursor })

    // delete all fetched customers
    const results = await Promise.all(customers.data.map(c => clients.stripe.customers.del(c.id)));

    const numOfDeleted = results.filter(c => c.deleted).length;
    totalNumOfDeleted += numOfDeleted

    console.log(`deleted ${numOfDeleted}; total ${totalNumOfDeleted}`)

    // recursively check for more customers
    if (customers.has_more && customers.data.length > 0) {
        // const customerIds = customers.data.map(c => c.id).sort();
        const lastCustomerId = customers.data[customers.data.length - 1].id;
        await new Promise(resolve => setTimeout(resolve, 1000));
        await loop(lastCustomerId);
    }
}

loop()
    .then(_ => console.log('done'));