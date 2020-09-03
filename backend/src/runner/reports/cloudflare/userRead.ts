import { CloudflareApi } from '.';
import { ApiRegion } from '..';
import { clients } from "../../clients";
import { Report } from '../report';

interface Response {
    success: boolean
}

class CloudflareUserRead extends Report {
    constructor() {
        super(CloudflareApi.Service, ApiRegion.Global, CloudflareApi.Api.User, CloudflareApi.Version, 'Read');
    }

    description(): string {
        return `Read User properties, asserts success.`;
    }

    async run(): Promise<boolean> {
        const response: Response = await clients.cloudflare.user.read();

        if (response && response.success) {
            return true;
        }

        throw Error('User read response was not successful.')
    }
}

export const CloudflareUserReadRunners: Array<Report> = [
    new CloudflareUserRead()
];