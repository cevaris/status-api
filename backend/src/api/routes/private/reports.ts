import express from 'express';
import { renderJson } from '../../../common/renderer';
import { StatusReport, StatusReportStore } from '../../../common/storage/statusReport';
import { Presenter } from '../../presenter';

const router = express.Router();

interface ReportsNameRequest extends express.Request {
    params: {
        name: string;
    }
}

router.get('/private/reports/:name.json', async function (req: ReportsNameRequest, res: express.Response) {
    try {
        let entities: Array<StatusReport> = [];
        entities = await StatusReportStore.getLastHour(req.params.name);

        res.type('json')
            .send(renderJson(Presenter.statusReports(entities)));
    } catch (error) {
        return res.status(503)
            .json({ ok: false, message: error.message });
    }
});

module.exports = router;