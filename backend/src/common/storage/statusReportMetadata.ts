import { Datastore, Query } from '@google-cloud/datastore';

export interface StatusReportMetadata {
    key: string
    description: string
    tags: Array<string>
    service: string
    region: string
    version: string
    api: string
    action: string
    isDebug: boolean
}

class StatusReportMetadataDatastore {
    private static kind = 'StatusReportMetadata';
    private datastore: Datastore;

    constructor() {
        this.datastore = new Datastore();
    }

    async all(): Promise<Array<StatusReportMetadata>> {
        const query: Query = this.datastore
            .createQuery(StatusReportMetadataDatastore.kind);
        const [results, _] = await this.datastore.runQuery(query);
        return results;
    }

    async get(key: string): Promise<StatusReportMetadata> {
        const query: Query = this.datastore
            .createQuery(StatusReportMetadataDatastore.kind)
            .filter('key', key.trim());
        const [results, _] = await this.datastore.runQuery(query);
        if (results.length == 1) {
            return results[0];
        } else {
            throw Error(`StatusReportMetadata ${key} not found`);
        }
    }

    async getTag(tag: string): Promise<Array<StatusReportMetadata>> {
        const query: Query = this.datastore
            .createQuery(StatusReportMetadataDatastore.kind)
            .filter('tags', tag.trim());
        const [results, _] = await this.datastore.runQuery(query);
        return results;
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

export const StatusReportMetadataDB = new StatusReportMetadataDatastore();