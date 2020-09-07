import fs from 'fs';
import { SlackApi } from '.';
import { ApiRegion } from '..';
import { clients } from "../../clients";
import { Report } from '../report';
import { Config } from '../../../common/config';


interface Response {
    ok: boolean,
}

class SlackConversationHistory extends Report {
    constructor() {
        super(SlackApi.Service, ApiRegion.Global, SlackApi.Api.Conversations, SlackApi.Version, 'History');
    }

    description(): string {
        return `Requests channel's conversation history. Asserts messages are returned.`;
    }

    async run(): Promise<boolean> {
        const response: Response = await clients.slack.conversations.history({
            channel: Config.SLACK_CHANNEL
        });

        return response.ok;
    }
}

export const SlackConversationHistoryRunners: Array<Report> = [
    new SlackConversationHistory()
];