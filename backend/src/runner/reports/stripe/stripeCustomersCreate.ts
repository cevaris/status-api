import { StripApi } from ".";
import { ApiRegion } from "..";
import { clients } from "../../clients";
import { Report } from "../report";

interface Response {
    id: string
    name: string | null
}

class StripeCustomerCreateReport extends Report {
    customerId: string = ''

    constructor() {
        super(StripApi.Service, ApiRegion.Global, StripApi.Api.Customers, StripApi.Version, 'Create')
    }

    description(): string {
        return `Using version ${this.version}, asserts customer creation is successful.`;
    }

    async run(): Promise<boolean> {
        const now = Date.now();
        const name = `customer_${now}`;
        const customer: Response = await clients.stripe.customers.create({
            name: name,
        });
        this.customerId = customer.id;
        return customer.name === name;
    }

    async cleanup(): Promise<void> {
        await clients.stripe.customers.del(this.customerId);
    }
}

export const StripeCustomerCreateReportRunners = [new StripeCustomerCreateReport()];