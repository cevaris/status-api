import { Datastore } from '@google-cloud/datastore';


export interface StatusReportMetadata {
    key: string
    description: string,
    tags: Array<string>,
    service: string,
    region: string,
    version: string
    api: string
    action: string
}

class StatusReportMetadataDatastore {
    private static kind = 'StatusReportMetadata';
    private datastore: Datastore;

    constructor() {
        this.datastore = new Datastore();
    }

    async set(statusReports: Array<StatusReportMetadata>): Promise<void> {
        const entities = statusReports.map(statusReportMetadata => {
            const key = this.datastore.key([StatusReportMetadataDatastore.kind, statusReportMetadata.key]);
            return {
                key: key,
                data: statusReportMetadata
            }
        });

        await this.datastore.upsert(entities);
    }
}

export const StatusReportMetadataStore = new StatusReportMetadataDatastore();