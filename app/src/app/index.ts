export interface StatusReport {
    latencyMs: number
    startDate: Date
    message: string
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

export interface AppRoute {
    name: string
    route: string
}