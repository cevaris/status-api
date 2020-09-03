import { Config } from "../../common/config";

export const cf = require('cloudflare')({
    token: Config.CLOUDFLARE_API_TOKEN
});