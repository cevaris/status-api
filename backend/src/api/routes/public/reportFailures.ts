import express from 'express';
import { StatusReport, StatusReportStore } from '../../../common/storage/statusReport';

const router = express.Router();
const PublicMaxLatestFailures = 10;

interface ReportsNameRequest extends express.Request {
    params: {
        name: string;
    }
    query: {
        limit: string
    }
}

/**
 * PUBLIC API
 * PRIVATE API
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

    try {
        entities = await StatusReportStore.getLastErrorsForReport(req.params.name, limit)
        res.type('json').send(entities);
    } catch (error) {
        res.status(503)
            .json({ ok: false, message: error.message });
    }
});

module.exports = router;