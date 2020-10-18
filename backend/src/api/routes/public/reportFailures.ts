import express from 'express';
import { isValidDate } from '../../../common/date';
import { renderJson } from '../../../common/renderer';
import { StatusReport, StatusReportStore } from '../../../common/storage/statusReport';
import { Presenter } from '../../presenter';

const router = express.Router();
const PublicMaxLatestFailures = 60;
const reportEpoch = new Date(Date.parse('2020-09-01T00:00:00.000Z'));

interface ReportsNameRequest extends express.Request {
    params: {
        name: string;      // string
    }
    query: {
        limit: string      // number
        start_date: string // date
    }
}

/**
 * PUBLIC API
 */
router.get('/reports/failures/:name.json', async function (req: ReportsNameRequest, res: express.Response) {
    let entities: Array<StatusReport> = [];

    let limit = PublicMaxLatestFailures;
    if (req.query.limit) {
        limit = parseInt(req.query.limit);
        if (isNaN(limit)) {
            return res.status(400)
                .json(Presenter.badRequest(`limit value '${req.query.limit}' is not a number`));
        }
        if (limit > PublicMaxLatestFailures) {
            return res.status(400)
                .json(Presenter.badRequest(`limit value '${limit}' cannot be larger than ${PublicMaxLatestFailures}`));
        }
    }

    let startDate = undefined;
    if (req.query.start_date) {
        startDate = new Date(Date.parse(req.query.start_date));
        if (!isValidDate(startDate)) {
            return res.status(400)
                .json(Presenter.badRequest(`start_date '${req.query.start_date}' is invalid. Provide a valid ISO 8601 UTC format.`));
        }
        if (startDate.getTime() < reportEpoch.getTime()) {
            return res.status(400)
                .json(Presenter.badRequest(`start_date value cannot be before ${reportEpoch}`));
        }
    }

    try {
        entities = await StatusReportStore.getErrorsForReport(req.params.name, limit, startDate);
        res.type('json')
            .send(renderJson(Presenter.statusReports(entities)));
    } catch (error) {
        res.status(503)
            .json(Presenter.serverUnavailable(error));
    }
});

module.exports = router;