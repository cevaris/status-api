export interface StatusReport {
    latencyMs: number
    startDate: Date
    ok: boolean
}

export interface StatusReportMetadata {
    key: string
    description: string,
    tags: Array<string>,
    service: string,
    action: string,
    region: string,
    version: string
    api: string
}