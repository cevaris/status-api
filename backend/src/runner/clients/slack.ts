import { WebClient } from '@slack/web-api';
import { Config } from "../../common/config";

export const slack = new WebClient(Config.SLACK_TOKEN);