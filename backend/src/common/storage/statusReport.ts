import { Datastore } from '@google-cloud/datastore';


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

class StatusReportDatastore {
    private static kind = 'StatusReportMinute';
    private datastore: Datastore;

    constructor() {
        this.datastore = new Datastore();
    }

    async set(statusReport: StatusReport): Promise<void> {
        // console.log('writing', statusReport);
        const minuteEpoch = getMinuteEpoch(statusReport.startDate);
        const name: string = `${statusReport.name}:${minuteEpoch}`
        const recordKey = this.datastore.key([StatusReportDatastore.kind, name])

        const record = {
            key: recordKey,
            data: statusReport
        }
        await this.datastore.save(record);
    }

    async getLatest(): Promise<StatusReport> {
        const query = this.datastore.createQuery(StatusReportDatastore.kind)
            .order('endDate', {descending: true})
            .limit(1);
        const [results, _] = await this.datastore.runQuery(query);

        if (results.length == 1) {
            return results[0];
        } else {
            throw new Error('Failed to find latest record');
        }
    }
}

export const StatusReportStore = new StatusReportDatastore();