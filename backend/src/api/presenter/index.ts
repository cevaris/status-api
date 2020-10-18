import { StatusReport } from "../../common/storage/statusReport";
import { ApiEntities, ApiStatusReport } from "./api";


export module Presenter {
    export function badRequest(message: string): ApiEntities<null> {
        return error(400, new Error(message));
    }

    export function serverUnavailable(err: Error): ApiEntities<null> {
        return error(503, err);
    }

    export function statusReports(xs: Array<StatusReport>): ApiEntities<ApiStatusReport> {
        const apiStatusReports: Array<ApiStatusReport> = xs.map(report => {
            return statusReport(report);
        });

        return {
            data: apiStatusReports
        };
    }

    function error(status: number, error: Error): ApiEntities<null> {
        const apiError = {
            code: status,
            message: error.message
        }

        return {
            error: apiError
        }
    }

    function statusReport(report: StatusReport): ApiStatusReport {
        return {
            type: 'status_report',
            name: report.name,
            success: report.ok,
            latency_ms: report.latencyMs,
            failure_message: report.message,
            start_date: report.startDate,
            end_date: report.endDate,
        };
    }
}

