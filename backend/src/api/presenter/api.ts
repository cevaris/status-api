export interface ApiError {
    code: number
    message: string
}
export interface ApiEntities<T> {
    data?: T[]
    error?: ApiError
}

export interface ApiStatusReport {
    type: 'status_report'
    key: string
    success: boolean
    start_date: Date
    end_date: Date
    latency_ms: number
    failure_message?: string
}

export interface ApiStatusReportMetadata {
    type: 'status_report_metadata'
    key: string
    description: string
    service: string
    region: string
    version: string
    api: string
    action: string
}
