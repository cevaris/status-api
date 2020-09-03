import { CloudflareApi } from '.';
import { ApiRegion } from '..';
import { clients } from "../../clients";
import { Report } from '../report';

interface Response {
    success: boolean
}

class CloudflareIPsRead extends Report {
    constructor() {
        super(CloudflareApi.Service, ApiRegion.Global, CloudflareApi.Api.IPs, CloudflareApi.Version, 'Read');
    }

    description(): string {
        return `Read Cloudflare IP addresses, asserts success.`;
    }

    async run(): Promise<boolean> {
        const response: Response = await clients.cloudflare.ips.browse();

        if (response && response.success) {
            return true;
        }

        throw Error('IPs read response was not successful.')
    }
}

export const CloudflareIPsReadRunners: Array<Report> = [
    new CloudflareIPsRead()
];