
import { GithubApi } from '.';
import { ApiRegion } from '..';
import { clients } from "../../clients";
import { Report } from '../report';


interface Response {
    data: {
        twitter_username: string
    }
}

class GithubUserUpdateAuthenticated extends Report {
    constructor() {
        super(GithubApi.Service, ApiRegion.Global, GithubApi.Api.Users, GithubApi.Version, 'Update Authenticated');
    }

    description(): string {
        return `Update authenticated user.`;
    }

    async run(): Promise<boolean> {
        const nowTime = new Date().getTime();

        const response: Response = await clients.github.users.updateAuthenticated({
            twitter_username: nowTime.toString()
        })

        if (!response) {
            throw Error('undefined response');
        }

        if (response?.data?.twitter_username === nowTime.toString()) {
            return true;
        }

        return false;
    }
}

export const GithubUserUpdateAuthenticatedRunners: Array<Report> = [
    new GithubUserUpdateAuthenticated()
];