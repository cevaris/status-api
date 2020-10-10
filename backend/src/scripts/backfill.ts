import { Datastore } from '@google-cloud/datastore';
import { program } from 'commander';
import { StatusReportStore } from "../common/storage/statusReport";

program
    .requiredOption('-s, --start-date <start>', 'start date')
    .requiredOption('-e, --end-date <end>', 'end date')
    ;

program.parse(process.argv);

const startDate: Date = new Date(Date.parse(program.startDate));
const endDate: Date = new Date(Date.parse(program.endDate));
const datastore = new Datastore();

let currDate: Date = startDate;
let totalBackfilled = 0;
let backfillDone = false;

async function main() {
    while (currDate < endDate) {
        const results = await StatusReportStore.get(currDate, 500);
        const filtered = results.filter(sr => sr.isDebug === undefined);
        const updated = filtered.map(sr => {
            sr.isDebug = Boolean(sr.name.match(/error/i) || sr.name.match(/random/i));
            return sr;
        });

        if (updated.length > 0) {
            const entities = updated.map((statusReport: any) => {
                return {
                    key: statusReport[datastore.KEY],
                    data: JSON.parse(JSON.stringify(statusReport))
                };
            });

            await datastore.update(entities);

            totalBackfilled += entities.length;
            console.log(`backfilled ${entities.length}, total: ${totalBackfilled}`, currDate);
        } else {
            console.log(`nothing to see here`, currDate);
        }

        if (results.length > 0) {
            currDate = results[results.length - 1].startDate;
        }
    }

    backfillDone = true;
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