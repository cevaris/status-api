import { WebAPICallResult } from '@slack/web-api';
import { v4 as uuidv4 } from 'uuid';
import { SlackApi } from '.';
import { ApiRegion } from '..';
import { clients } from "../../clients";
import { Report } from '../report';

interface Response extends WebAPICallResult {
    call?: {
        id?: string
    }
}

class SlackCallsAdd extends Report {
    id: string = ''

    constructor() {
        super(SlackApi.Service, ApiRegion.Global, SlackApi.Api.Calls, SlackApi.Version, 'Add');
    }

    description(): string {
        return `Registers a new Call.`;
    }

    async run(): Promise<boolean> {
        const response: Response = await clients.slack.calls.add({
            external_unique_id: uuidv4(),
            join_url: 'https://example.com/calls/1234567890',
        });

        if (!response.call?.id) {
            throw Error('no call id was returned')
        }

        this.id = response.call?.id;

        return response.ok;
    }

    async cleanup(): Promise<void> {
        await clients.slack.calls.end({
            id: this.id,
        });
    }
}

export const SlackCallsAddRunners: Array<Report> = [
    new SlackCallsAdd()
];