import express from 'express';
import { renderJson } from '../../common/renderer';
import { StatusReport, StatusReportStore } from '../../common/storage/statusReport';

const router = express.Router();

interface ReportsNameRequest extends express.Request {
    params: {
        name: string;
    }
    query: { latest_failures?: string };
}

const MaxLatestFailures = 10;

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

            entities = await StatusReportStore.getLastErrors(req.params.name, latestFailures)
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