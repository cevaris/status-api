import { Datastore, Query } from '@google-cloud/datastore';
import { Transform } from 'stream';


export interface StatusReport {
    name: string
    ok: boolean
    latencyMs: number
    message?: string
    startDate: Date
    endDate: Date
    isDebug: boolean
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

    /**
     * Exclude isDebug=true reports if in production.
     */
    private includeDebugReports = process.env.NODE_ENV !== "production";

    constructor() {
        this.datastore = new Datastore();
    }

    async set(statusReport: StatusReport): Promise<void> {
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
            .order('startDate', { descending: true })
            .limit(1);
        const [results, _] = await this.datastore.runQuery(query);

        if (results.length == 1) {
            return results[0];
        } else {
            throw new Error('Failed to find latest record');
        }
    }

    // Do a batch query on key, so we do not have to index
    // https://cloud.google.com/datastore/docs/concepts/entities#datastore-datastore-batch-lookup-nodejs
    async getLastHour(name: string): Promise<Array<StatusReport>> {
        const sixtyMinutesMs = 60 * 1000 * 60;
        const toStartDate = getDateMinute(new Date());
        const fromStartDate = new Date(toStartDate.getTime() - sixtyMinutesMs);

        console.log('getLastHour', name, fromStartDate, toStartDate);

        const query: Query = this.datastore
            .createQuery(StatusReportDatastore.kind)
            .filter('name', '=', name)
            .filter('startDate', '>', fromStartDate)
            .filter('startDate', '<=', toStartDate);
        const [results, _] = await this.datastore.runQuery(query);
        return results;
    }

    async getLastErrorsForReport(name: string, n: number): Promise<Array<StatusReport>> {
        const query: Query = this.datastore
            .createQuery(StatusReportDatastore.kind)
            .filter('ok', '=', false)
            .filter('name', '=', name)
            .order('startDate', { descending: true })
            .limit(n);

        const [results, errors] = await this.datastore.runQuery(query);
        return results;
    }

    async getLastErrorsAll(n: number): Promise<Array<StatusReport>> {
        const query: Query = this.datastore
            .createQuery(StatusReportDatastore.kind)
            .filter('ok', '=', false)
            .filter('isDebug', '=', this.includeDebugReports)
            .order('startDate', { descending: true })
            .limit(n);

        const [results, errors] = await this.datastore.runQuery(query);
        return results;
    }

    streamErrorsAll(fromStartDate: Date): Transform {
        const query: Query = this.datastore
            .createQuery(StatusReportDatastore.kind)
            .filter('ok', '=', false)
            .filter('isDebug', '=', this.includeDebugReports)
            .filter('startDate', '>', fromStartDate)
            .order('startDate', { descending: true });

        return this.datastore.runQueryStream(query);
    }
}

export const StatusReportStore = new StatusReportDatastore();