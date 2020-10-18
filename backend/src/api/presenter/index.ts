import { StatusReport } from "../../common/storage/statusReport";
import { StatusReportMetadata } from "../../common/storage/statusReportMetadata";
import { ApiEntities, ApiStatusReport, ApiStatusReportMetadata } from "./api";


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

    export function statusReportMetadatas(xs: Array<StatusReportMetadata>): ApiEntities<ApiStatusReportMetadata> {
        const apiStatusReports: Array<ApiStatusReportMetadata> = xs.map(x => {
            return statusReportMetadata(x);
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
            key: report.name,
            success: report.ok,
            latency_ms: report.latencyMs,
            failure_message: report.message,
            start_date: report.startDate,
            end_date: report.endDate,
        };
    }

    function statusReportMetadata(x: StatusReportMetadata): ApiStatusReportMetadata {
        return {
            type: 'status_report_metadata',
            key: x.key,
            description: x.description,
            service: x.service,
            region: x.region,
            version: x.version,
            api: x.api,
            action: x.action
        };
    }
}

