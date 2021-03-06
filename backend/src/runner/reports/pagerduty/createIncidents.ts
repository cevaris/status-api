import { PagerdutyApi } from '.';
import { ApiRegion } from '..';
import { Config } from '../../../common/config';
import { clients } from "../../clients";
import { Report } from '../report';


interface Response {
    body: {
        incident: {
            title: string
        }
    }
}

// https://developer.pagerduty.com/api-reference/reference/REST/openapiv3.json/paths/~1incidents/post
class PagerdutyCreateIncident extends Report {
    constructor() {
        super(PagerdutyApi.Service, ApiRegion.Global, PagerdutyApi.Api.Incidents, PagerdutyApi.Version, 'Create');
    }

    description(): string {
        return `Create an incident.`;
    }

    async run(): Promise<boolean> {
        const nowTime = new Date().getTime();
        const response: Response = await clients.pagerduty.incidents.createIncident(
            Config.PAGERDUTY_FROM,
            {
                incident: {
                    type: 'incident',
                    title: `StatusAPI Incident ${nowTime}`,
                    service: {
                        id: Config.PAGERDUTY_SERVICE,
                        type: 'service_reference'
                    },
                }
            });

        if (response.body && response.body.incident && response.body.incident.title) {
            return response.body.incident.title.includes(nowTime.toString());
        }

        return false;
    }
}

export const PagerdutyCreateIncidentRunners: Array<Report> = [
    new PagerdutyCreateIncident()
];