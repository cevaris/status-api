import { Datastore } from '@google-cloud/datastore';
import { program } from 'commander';
import { StatusReportStore } from "../common/storage/statusReport";

program
    .option('-c, --cursor <value>', 'cursor to start backfill')
    ;

program.parse(process.argv);

const datastore = new Datastore();

let totalBackfilled = 0;
let backfillDone = false;

let cursor: string;
if (program.cursor) {
    cursor = program.cursor;
}

async function main() {

    while (true) {
        const [results, { endCursor }] = await StatusReportStore.scan(500, cursor);
        // console.log(results.map(sr => sr.startDate instanceof Date));

        const updated = results.map((sr) => {
            // convert date string to Date type
            if (typeof sr.startDate === 'string') {
                sr.startDate = new Date(Date.parse(sr.startDate));
            }
            if (typeof sr.endDate === 'string') {
                sr.endDate = new Date(Date.parse(sr.endDate));
            }

            // kill older unused fields
            if ((sr as any).startDateMs) {
                (sr as any).startDateMs = undefined;
            }
            if ((sr as any).endDateMs) {
                (sr as any).endDateMs = undefined;
            }

            return sr;
        });
        // console.log(updated.map(sr => sr.startDate instanceof Date));

        if (updated.length > 0) {
            const entities = updated.map((statusReport: any) => {
                return {
                    key: statusReport[datastore.KEY],
                    data: statusReport
                };
            });

            await datastore.update(entities);

            totalBackfilled += entities.length;
            console.log(`backfilled ${entities.length}, total: ${totalBackfilled}`, cursor);
        } else {
            console.log(`nothing to see here`, cursor);
        }

        if (endCursor) {
            cursor = endCursor;
        } else {
            console.log('end of the road...');
            break;
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
