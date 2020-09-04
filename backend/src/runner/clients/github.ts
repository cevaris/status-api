import { Octokit } from "@octokit/rest";
import { Config } from "../../common/config";


export const github = new Octokit({
    auth: Config.GITHUB_PERSONAL_ACCESS_TOKEN,
});
