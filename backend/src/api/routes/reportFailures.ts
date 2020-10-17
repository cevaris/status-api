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

module.exports = router;