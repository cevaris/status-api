import express from 'express';
import { StatusReport, StatusReportStore } from '../../../common/storage/statusReport';

const router = express.Router();

interface ReportsNameRequest extends express.Request {
    query: {
        start_date: string;
    }
}

/**
 * PUBLIC API
 */
router.get('/reports/failures/:name.json', async function (req: ReportsNameRequest, res: express.Response) {
    let entities: Array<StatusReport> = [];
    if (req.query.start_date) {
        let latestFailures = parseInt(req.query.start_date as string);
        if (isNaN(latestFailures)) {
            return res.status(400)
                .json({ ok: false, message: `start_date value '${req.query.start_date}' is not a number` })
        }

        try {
            entities = await StatusReportStore.getLastErrorsForReport(req.params.name, latestFailures)
            res.type('json').send(entities);
        } catch (error) {
            res.status(503)
                .json({ ok: false, message: error.message });
        }
    } else {
        return res.status(400)
            .json({ ok: false, message: 'start_date parameter is required' });
    }
});

module.exports = router;