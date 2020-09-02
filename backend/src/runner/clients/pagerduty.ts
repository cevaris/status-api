import { Config } from "../../common/config";

const pdClient = require('node-pagerduty');

export const pagerduty = new pdClient(Config.PAGERDUTY_TOKEN);