import { Datastore, Query } from '@google-cloud/datastore';

export interface StatusReport {
    name: string
    ok: boolean
    latencyMs: number
    message?: string
    startDate: Date
    endDate: Date
}

function getMinuteEpoch(date: Date): number {
    const dateMinute = getDateMinute(date);
    const minuteEpoch = Math.round(dateMinute.getTime() / 1000)
    return minuteEpoch;
}

/**
 * Truncate seconds and milliseconds
 * @param date 
 */
function getDateMinute(date: Date): Date {
    const dateMinute = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
    return dateMinute;
}

class ReportsDatastore {
    private static kind = 'StatusReportMinute';
    private datastore: Datastore;

    constructor() {
        this.datastore = new Datastore();
    }

    // Do a batch query on key, so we do not have to index
    // https://cloud.google.com/datastore/docs/concepts/entities#datastore-datastore-batch-lookup-nodejs
    async getLastHour(name: string): Promise<Array<StatusReport>> {
        const sixtyMinutesMs = 60 * 1000 * 60;
        const toStartDate = getDateMinute(new Date());
        const fromStartDate = new Date(toStartDate.getTime() - sixtyMinutesMs);

        console.log('getLastHour', name, fromStartDate, toStartDate);

        const query: Query = this.datastore
            .createQuery(ReportsDatastore.kind)
            .filter('name', '=', name)
            .filter('startDate', '>', fromStartDate)
            .filter('startDate', '<=', toStartDate);
        const [results, _] = await this.datastore.runQuery(query);
        return results;
    }

    // http://localhost:8080/RandomLatencies.json

    // Do a batch query on key, so we do not have to index
    // https://cloud.google.com/datastore/docs/concepts/entities#datastore-datastore-batch-lookup-nodejs
}

export const ReportsDB = new ReportsDatastore();