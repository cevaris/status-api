import express from 'express';
import { renderJson } from '../../common/renderer';
import { StatusReport, StatusReportStore } from '../../common/storage/statusReport';

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

interface ReportsNameRequest extends express.Request {
    params: {
        name: string;
    }
}

router.get('/reports/failures/:name.json', async function (req: ReportsNameRequest, res: express.Response) {
    let entities: Array<StatusReport> = [];
    if (req.query.latest_failures) {
        let latestFailures = parseInt(req.query.latest_failures as string);
        if (isNaN(latestFailures)) {
            return res.status(400)
                .json({ ok: false, message: `latest_failures value '${req.query.latest_failures}' is not a number` })
        }
        if (latestFailures > MaxLatestFailures) {
            return res.status(400)
                .json({ ok: false, message: `latest_failures value '${latestFailures}' cannot be larger than ${MaxLatestFailures}` })
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
            .json({ ok: false, message: 'latest_failures parameter is required' });
    }
});

module.exports = router;