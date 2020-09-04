import { StatusReport } from "../../common/storage/statusReport";
import { Report } from "./report";
import { Stopwatch } from "../../common/stopwatch";

export const REPORT_TIMEOUT_MS = 10 * 1000;

export type FuncRunner = (runnerConfig: Report) => Promise<boolean>

const TIMEOUT_ERROR = new Error('Report runner timed-out');
const timeoutPromise = () => new Promise<boolean>(
    (_, reject) => setTimeout(() => reject(TIMEOUT_ERROR), REPORT_TIMEOUT_MS)
)

export async function funcRunner(reportRunner: Report): Promise<StatusReport> {
    const stopwatch = new Stopwatch();
    let report: StatusReport;

    try {
        stopwatch.start();

        // execution races against report timeout
        const result = await Promise.race([reportRunner.run(), timeoutPromise()]);
        stopwatch.stop();

        report = {
            name: reportRunner.key(),
            ok: result,
            ...stopwatch.results()
        }
    } catch (error) {
        stopwatch.stop();

        // avoid writing [object Object] objects
        let message = error.toString();
        if (typeof error === 'object') {
            message = JSON.stringify(error);
        }

        report = {
            name: reportRunner.key(),
            ok: false,
            message: message,
            ...stopwatch.results(),
        }
    }

    // console.log(report);
    return report;
}