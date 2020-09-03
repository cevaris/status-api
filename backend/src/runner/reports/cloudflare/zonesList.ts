import { CloudflareApi } from '.';
import { ApiRegion } from '..';
import { clients } from "../../clients";
import { Report } from '../report';

interface Response {
    success: boolean
}

class CloudflareZonesRead extends Report {
    constructor() {
        super(CloudflareApi.Service, ApiRegion.Global, CloudflareApi.Api.Zones, CloudflareApi.Version, 'Read');
    }

    description(): string {
        return `Read zone properties, asserts success.`;
    }

    async run(): Promise<boolean> {
        const response: Response = await clients.cloudflare.zones.read('fa9407ebb58bf0bdb94ff032837ff5ab');

        if (response && response.success) {
            return true;
        }

        throw Error('Zone read response was not successful.')
    }
}

export const CloudflareZonesReadRunners: Array<Report> = [
    new CloudflareZonesRead()
];