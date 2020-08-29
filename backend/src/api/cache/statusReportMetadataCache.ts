import elasticlunr from 'elasticlunr';
import { StatusReportMetadata, StatusReportMetadataDB } from "../storage/statusReportMetadata";

// http://elasticlunr.com/

class StatusReportMetadataElasticlunr {
    index: elasticlunr.Index<StatusReportMetadata> = this.initIndex();
    cache: Map<String, StatusReportMetadata>;

    constructor() {
        this.cache = new Map();
        this.update(this);
    }

    async get(query: string): Promise<StatusReportMetadata[]> {
        if (this.cache.size == 0) {
            const srMetdata = await StatusReportMetadataDB.all();
            srMetdata.forEach(x => this.cache.set(x.key, x));
        }

        const searchResults = this.index.search(query, {
            fields: {
                key: { boost: 1, expand: true, bool: "OR" },
                tags: { boost: 2, expand: true, bool: "OR" }
            }
        });
        const refs = searchResults.map(r => r.ref);
        console.log(refs);

        const results: StatusReportMetadata[] = [];
        refs.forEach(ref => {
            const hit = this.cache.get(ref);
            if (hit) {
                results.push(hit);
            }
        });

        return results;
    }

    private async update(ref: StatusReportMetadataElasticlunr) {
        const srMetadata = await StatusReportMetadataDB.all();
        const newIndex = this.initIndex();


        srMetadata.forEach(srm => newIndex.addDoc(srm));

        ref.index = newIndex;
    }

    private initIndex() {
        return elasticlunr<StatusReportMetadata>(function () {
            this.addField('key');
            this.addField('tags');
            this.setRef('key');
        });
    }
}

class StatusReportMetadataRegex {
    cache: Array<StatusReportMetadata>;

    constructor() {
        this.cache = new Array();
        this.update();

        setInterval((a: StatusReportMetadataRegex) => a.update(), 10 * 1000, this);
    }

    async get(query: string): Promise<StatusReportMetadata[]> {
        if (this.cache.length == 0) {
            await this.update();
        }

        const results: Set<StatusReportMetadata> = new Set();
        const tokens = query.trim().split(' ');

        this.cache.forEach(candidate => {
            let matchesAll = true;
            tokens.forEach(q => {
                if (candidate.key.search(new RegExp(q, 'i')) == -1) {
                    matchesAll = false;
                }
            });
            if (matchesAll) {
                results.add(candidate);
            }
        })
        return Array.from(results);
    }

    private async update() {
        this.cache = await StatusReportMetadataDB.all();
    }
}

export const StatusReportMetadataCache = new StatusReportMetadataRegex();