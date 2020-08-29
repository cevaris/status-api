import { Datastore, Query } from '@google-cloud/datastore';


export interface StatusApiReportQuery {
    value: string
    createdAt: Date
}

class StatusApiReportQueryDatastore {
    private Kind = 'StatusApiReportQuery';
    private datastore: Datastore;

    constructor() {
        this.datastore = new Datastore();
    }

    async save(q: string): Promise<void> {
        const data: StatusApiReportQuery = {
            value: q.trim().toLocaleLowerCase(),
            createdAt: new Date()
        }

        const recordKey = this.datastore.key([this.Kind])

        const record = {
            key: recordKey,
            data: data
        }

        console.log('writing', record);
        await this.datastore.save(record);
    }
}

export const StatusApiReportQueryDB = new StatusApiReportQueryDatastore();