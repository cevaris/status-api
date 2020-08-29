import { ErrorsApi } from ".";
import { ApiRegion } from "..";
import { REPORT_TIMEOUT_MS } from "../runner";
import { Report } from "../report";

const sleep = require('util').promisify(setTimeout)

class ErrorTimeoutReport extends Report {
    constructor() {
        super(ErrorsApi.Service, ApiRegion.Global, ErrorsApi.Name, ErrorsApi.Version, 'Timeout');
    }

    description(): string {
        return 'Sleeps past the request timeout. Expected to always fail due to timeout. For debugging purposes only.';
    }

    async run(): Promise<boolean> {
        await sleep(REPORT_TIMEOUT_MS + 10);
        // expect timeout to fire before getting here 
        return Promise.resolve(true);
    }
}

export const ErrorTimeoutReportRunner = [new ErrorTimeoutReport()];