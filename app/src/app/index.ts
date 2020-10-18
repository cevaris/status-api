export interface ApiError {
    code: number
    message: string
}
export interface ApiEntities<T> {
    data?: T[]
    error?: ApiError
}

export interface ApiStatusReport {
    key: string
    success: boolean
    start_date: Date
    latency_ms: number
    failure_message?: string
}

export interface ApiStatusReportMetadata {
    key: string
    description: string
    service: string
    region: string
    version: string
    api: string
    action: string
}

export interface AppRoute {
    name: string
    route: string
}

