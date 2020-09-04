import { GithubApi } from '.';
import { ApiRegion } from '..';
import { clients } from "../../clients";
import { Report } from '../report';


interface Response {
    data: {
        login: string
    }
}

class GithubUserGetAuthenticated extends Report {
    constructor() {
        super(GithubApi.Service, ApiRegion.Global, GithubApi.Api.Users, GithubApi.Version, 'Get Authenticated');
    }

    description(): string {
        return `Gets authenticated user.`;
    }

    async run(): Promise<boolean> {

        const response: Response = await clients.github.request("/user");

        if (!response) {
            throw Error('undefined response');
        }

        if (response?.data?.login === 'cevaris') {
            return true;
        }

        return false;
    }
}

export const GithubUserGetAuthenticatedRunners: Array<Report> = [
    new GithubUserGetAuthenticated()
];