import { PagerdutyApi } from '.';
import { ApiRegion } from '..';
import { clients } from "../../clients";
import { Report } from '../report';


interface Response {
    body: string
}

class PagerdutyListIncidents extends Report {
    constructor() {
        super(PagerdutyApi.Service, ApiRegion.Global, PagerdutyApi.Api.Incidents, PagerdutyApi.Version, 'List');
    }

    description(): string {
        return `Lists incidents.`;
    }

    async run(): Promise<boolean> {
        const response: Response = await clients.pagerduty.incidents.listIncidents();

        if (response.body) {
            const body = JSON.parse(response.body);

            if (body.incidents.length > 0) {
                return true;
            }
        }

        throw Error('No incidents were returned in the response. ')
    }
}

export const PagerdutyListIncidentsRunners: Array<Report> = [
    new PagerdutyListIncidents()
];