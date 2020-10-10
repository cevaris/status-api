import { Datastore } from '@google-cloud/datastore';
import { program } from 'commander';
import { getMinuteEpoch, StatusReport, StatusReportStore } from "../common/storage/statusReport";

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
        const results = await StatusReportStore.get(currDate, 400);
        const filtered = results.filter(sr => sr.isDebug === undefined);
        const updated = filtered.map(sr => {
            sr.isDebug = Boolean(sr.name.match(/error/i) || sr.name.match(/random/i));
            return sr;
        });

        if (updated.length > 0) {
            // const transaction = datastore.transaction();
            // try {
            const entities = updated.map((statusReport: any) => {
                return {
                    key: statusReport[datastore.KEY],
                    data: JSON.parse(JSON.stringify(statusReport))
                };
            });

            //     await transaction.run();
            //     await transaction.update(entities);
            await datastore.update(entities);
            //     await transaction.commit();

            totalBackfilled += entities.length;
            console.log(`backfilled ${entities.length}, total: ${totalBackfilled}`, currDate);
            // } catch (error) {
            //     console.error(error);
            //     throw error;
            // } finally {
            //     console.error('rolling back');
            //     await transaction.rollback();
            //     console.error('rolled back');
            // }
        } else {
            console.log(`nothing to see here`, currDate);
        }

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