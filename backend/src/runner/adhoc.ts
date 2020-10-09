import { renderJson } from "../common/renderer";
import { funcRunner } from "./reports/runner";
import { reportFuncRunners } from "./runners";

async function executeReportRunner(key: string): Promise<void> {
    if (key) {
        const runner = reportFuncRunners.find(r => r.key() === key);
        if (runner) {
            const result = await funcRunner(runner);
            console.log(renderJson(result));
        } else {
            console.log(`report runner ${key} not found`);
        }
    }
}

const key = process.argv[2];
if (key) {
    // shutdown; dont wait for all other clients to spin up
    executeReportRunner(key).then(_ => process.exit(0));
} else {
    console.error(`missing key; exiting...`);
    process.exit(-1);
}