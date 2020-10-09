import { ErrorsApi } from ".";
import { ApiRegion } from "..";
import { Report } from "../report";

class ErrorThrowReport extends Report {
    constructor() {
        super(ErrorsApi.Service, ApiRegion.Global, ErrorsApi.Name, ErrorsApi.Version, 'throw');
        this.isDebug = true;
    }

    description(): string {
        return 'Throws error every time. Expect to fail every time. For debugging purposes only.';
    }

    run(): Promise<boolean> {
        return Promise.reject(Error('this error is intentional'))
    }
}

export const ErrorThrowReportRunner = [new ErrorThrowReport()];