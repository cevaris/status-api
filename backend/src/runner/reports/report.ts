import { normalize } from "../../common/string"

export abstract class Report {
    readonly service: string
    readonly region: string
    readonly api: string
    readonly version: string
    readonly action: string

    /**
     * Report is for debugging purposes only.
     */
    debug: boolean = false

    constructor(service: string, region: string, api: string, version: string, action: string) {
        this.service = service;
        this.region = region;
        this.api = api;
        this.version = version;
        this.action = action;
    }

    abstract description(): string
    abstract run(): Promise<boolean>

    // Hook to run clean up work post run() invocation
    // Note this is used so we can cleanup "off-clock" or without affecting latency times.
    cleanup(): Promise<void> { return Promise.resolve(); }

    key(): string {
        return `${this.service}:${this.region}:${this.api}:${normalize(this.action)}`.toLowerCase();
    }

    label(): string {
        return `${this.service} in ${this.region} region, ${this.api} API using version v${this.version}, ${this.action}`;
    }

    tags(): Array<string> {
        return [this.service, this.region, this.api, this.version, this.action];
    }


}