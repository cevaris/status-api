import fs from 'fs';
import { SlackApi } from '.';
import { ApiRegion } from '..';
import { clients } from "../../clients";
import { Report } from '../report';
import { Config } from '../../../common/config';


interface Response {
    ok: boolean,
}

class SlackConversationsSetTopic extends Report {
    constructor() {
        super(SlackApi.Service, ApiRegion.Global, SlackApi.Api.Conversations, SlackApi.Version, 'Set Topic');
    }

    description(): string {
        return `Sets the topic of a channel.`;
    }

    async run(): Promise<boolean> {
        const now = new Date().getTime();

        const response: Response = await clients.slack.conversations.setTopic({
            channel: Config.SLACK_CHANNEL,
            topic: `Topic ${now}`
        });

        return response.ok;
    }
}

export const SlackConversationsSetTopicRunners: Array<Report> = [
    new SlackConversationsSetTopic()
];