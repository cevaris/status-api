import express from 'express';
import { StatusReport, StatusReportStore } from '../../../common/storage/statusReport';

const router = express.Router();
const PublicMaxLatestFailures = 10;
const reportEpoch = new Date(Date.parse('2020-10-01T00:00:00.000Z'));

interface ReportsNameRequest extends express.Request {
    params: {
        name: string;      // string
    }
    query: {
        limit: string      // number
        start_date: string // date
        asc: string        // boolean
    }
}

/**
 * PUBLIC API
 */
router.get('/reports/failures/:name.json', async function (req: ReportsNameRequest, res: express.Response) {
    let entities: Array<StatusReport> = [];
    let limit = parseInt(req.query.limit) || PublicMaxLatestFailures;
    if (isNaN(limit)) {
        return res.status(400)
            .json({ ok: false, message: `limit value '${req.query.limit}' is not a number` })
    }
    if (limit > PublicMaxLatestFailures) {
        return res.status(400)
            .json({ ok: false, message: `limit value '${limit}' cannot be larger than ${PublicMaxLatestFailures}` })
    }

    let startDate: Date;
    if (req.query.start_date) {
        startDate = new Date(Date.parse(req.query.start_date));

        if (startDate.getTime() < reportEpoch.getTime()) {
            return res.status(400)
                .json({ ok: false, message: `start_date value cannot be before ${reportEpoch}` });
        }
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