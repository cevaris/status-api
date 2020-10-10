import { Datastore } from '@google-cloud/datastore';
import { program } from 'commander';
import { StatusReport, StatusReportStore } from "../common/storage/statusReport";

program
    .requiredOption('-s, --start-date <start>', 'start date')
    .requiredOption('-e, --end-date <end>', 'end date')
    ;

program.parse(process.argv);

const startDate: Date = new Date(Date.parse(program.startDate));
const endDate: Date = new Date(Date.parse(program.endDate));
const kind = 'StatusReportMinute';
const datastore = new Datastore();
// const reportsQueue: Array<StatusReport> = new Array();

let currDate: Date = startDate;
let totalBackfilled = 0;
let backfillDone = false;

console.log(currDate, endDate);


async function main() {
    while (currDate < endDate) {
        const results = await StatusReportStore.get(currDate, 500);
        console.log(results);
        // const filtered = results.filter(sr => sr.isDebug === undefined);
        // await backfill(filtered);

        currDate = results[results.length - 1].startDate;
    }

    backfillDone = true;
}

async function backfill(statusReports: Array<StatusReport>): Promise<void> {
    const chunk = statusReports.map(backfillIsDebug);

    if (chunk.length > 0) {
        await StatusReportStore.batchUpsert(chunk);
        totalBackfilled += chunk.length;

        const report = chunk[chunk.length - 1];
        console.log(`backfilled ${chunk.length}, total: ${totalBackfilled}`, report.name, report.startDate);

        // datastore can only write once per second
        await new Promise(resolve => setTimeout(resolve, 1100));
    }
}

function backfillIsDebug(statusReport: StatusReport): StatusReport {
    if (statusReport.isDebug === undefined) {
        statusReport.isDebug = false;
    }
    return statusReport;
}

// wait for backfill to complete
(function wait() {
    if (backfillDone) {
        console.log('...backfill done, exiting.');
    } else {
        // console.log('waiting...');
        setTimeout(wait, 1000);
    }
})();

main().catch(console.error);