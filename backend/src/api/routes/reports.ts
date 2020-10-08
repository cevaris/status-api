import express from 'express';
import { StatusReport, StatusReportStore } from '../../common/storage/statusReport';
import { v4 as uuid4 } from 'uuid';
import { renderJson } from '../../common/renderer';

const router = express.Router();

const MaxLatestFailures = 10;

router.get('/reports/failures.json', async function (req: express.Request, res: express.Response) {
    try {
        const entities: Array<StatusReport> =
            await StatusReportStore.getLastErrorsAll(MaxLatestFailures);

        return res.type('json').send(renderJson(entities));
    } catch (error) {
        return res.status(503)
            .json({ ok: false, message: error.message });
    }
});

// TODO: Pass in date paramter to start off where left off
router.get('/stream/reports/failures.json', async function (req: express.Request, res: express.Response) {
    res.type('json');

    const connection = uuid4();

    const startFromDate = new Date();
    // start stream 26 hours from now
    startFromDate.setHours(startFromDate.getHours() - 26);
    console.log(connection, 'start', startFromDate);

    try {

        StatusReportStore.streamErrorsAll(startFromDate)
            .on('error', console.error)
            .on('data', (entity) => {
                console.log(connection, 'entity', entity);
                res.write(renderJson(entity) + '\n');
            })
            .on('info', (info) => {
                console.log(connection, 'info', info);
            })
            .on('end', () => {
                console.log(connection, 'end');
                res.end();
            });
    } catch (error) {
        return res.status(503)
            .json({ ok: false, message: error.message });
    }
});


interface ReportsNameRequest extends express.Request {
    params: {
        name: string;
    }
    query: { latest_failures?: string };
}

router.get('/reports/:name.json', async function (req: ReportsNameRequest, res: express.Response) {

    try {
        let entities: Array<StatusReport> = [];
        if (req.query.latest_failures) {
            let latestFailures = parseInt(req.query.latest_failures);
            if (isNaN(latestFailures)) {
                return res.status(401)
                    .json({ ok: false, message: `latest_failures value '${req.query.latest_failures}' is not a number` })
            }
            if (Number.isInteger(latestFailures) && latestFailures > MaxLatestFailures) {
                return res.status(401)
                    .json({ ok: false, message: `latest_failures value '${latestFailures}' cannot be larger than ${MaxLatestFailures}` })
            }

            entities = await StatusReportStore.getLastErrorsForReport(req.params.name, latestFailures)
        } else {
            entities = await StatusReportStore.getLastHour(req.params.name);
            entities.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);
        }

        res.type('json')
            .send(entities);
    } catch (error) {
        return res.status(503)
            .json({ ok: false, message: error.message });
    }

});

module.exports = router;