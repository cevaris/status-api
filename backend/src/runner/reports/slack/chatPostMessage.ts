import fs from 'fs';
import { SlackApi } from '.';
import { ApiRegion } from '..';
import { clients } from "../../clients";
import { Report } from '../report';
import { Config } from '../../../common/config';


interface Response {
    ok: boolean
}

class ChatPostMessage extends Report {
    constructor() {
        super(SlackApi.Service, ApiRegion.Global, SlackApi.Api.Chat, SlackApi.Version, 'Post Message');
    }

    description(): string {
        return `Posts message to chat via chat.postMessage.`;
    }

    async run(): Promise<boolean> {
        const now = new Date().getTime();
        const response: Response = await clients.slack.chat.postMessage({
            text: `StatusAPI ping ${now}`,
            channel: Config.SLACK_CHANNEL
        });

        return response.ok;
    }
}

export const ChatPostMessageRunners: Array<Report> = [
    new ChatPostMessage()
];