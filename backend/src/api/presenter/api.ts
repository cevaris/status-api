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
    name: string
    success: boolean
    start_date: Date
    end_date: Date
    latency_ms: number
    failure_message?: string
}
