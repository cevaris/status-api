export interface ApiError {
    code: number
    message: string
}
export interface ApiEntities<T> {
    data?: T[]
    error?: ApiError
}

export interface ApiStatusReport {
    success: boolean
    start_date: Date
    latency_ms: number
    failure_message?: string
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

