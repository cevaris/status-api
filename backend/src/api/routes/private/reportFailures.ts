import express from 'express';
import { renderJson } from '../../../common/renderer';
import { StatusReport, StatusReportStore } from '../../../common/storage/statusReport';

const router = express.Router();

const MaxLatestFailures = 10;

router.get('/private/reports/failures.json', async function (req: express.Request, res: express.Response) {
    try {
        const entities: Array<StatusReport> =
            await StatusReportStore.getLastErrorsAll(MaxLatestFailures);

        return res.type('json').send(renderJson(entities));
    } catch (error) {
        return res.status(503)
            .json({ ok: false, message: error.message });
    }
});


interface ReportsNameRequest extends express.Request {
    params: {
        name: string;  // string
    }
    query: {
        limit: string; // number
    }
}

router.get('/private/reports/failures/:name.json', async function (req: ReportsNameRequest, res: express.Response) {
    let entities: Array<StatusReport> = [];
    let limit = parseInt(req.query.limit) || MaxLatestFailures;
    if (isNaN(limit)) {
        return res.status(400)
            .json({ ok: false, message: `limit value '${req.query.limit}' is not a number` })
    }
    if (limit > MaxLatestFailures) {
        return res.status(400)
            .json({ ok: false, message: `limit value '${limit}' cannot be larger than ${MaxLatestFailures}` })
    }

    try {
        entities = await StatusReportStore.getLastErrorsForReport(req.params.name, limit)
        res.type('json').send(entities);
    } catch (error) {
        res.status(503)
            .json({ ok: false, message: error.message });
    }
});

module.exports = router;