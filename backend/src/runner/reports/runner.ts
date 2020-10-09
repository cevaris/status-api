import { StatusReport } from "../../common/storage/statusReport";
import { Report } from "./report";
import { Stopwatch } from "../../common/stopwatch";
import { TimeoutError } from "../../common/errors";

export const REPORT_TIMEOUT_MS = 10 * 1000;

export type FuncRunner = (runnerConfig: Report) => Promise<boolean>;

const TIMEOUT_ERROR = new TimeoutError('Report runner timed-out');
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
            ...stopwatch.results(),
            isDebug: reportRunner.isDebug
        }
    } catch (error) {
        stopwatch.stop();

        let message = error.toString();

        // append time to error message
        if (error instanceof TimeoutError) {
            message = `${message}, ${stopwatch.results().latencyMs}ms`;
        }

        // avoid writing [object Object] objects
        if (message === '[object Object]') {
            message = JSON.stringify(error);
        }

        report = {
            name: reportRunner.key(),
            ok: false,
            message: message,
            ...stopwatch.results(),
            isDebug: reportRunner.isDebug
        }
    } finally {
        try {
            await reportRunner.cleanup();
        } catch (error) {
            console.log(error);
            // do nothing
        }
    }

    // console.log(report);
    return report;
}