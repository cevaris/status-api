import express from 'express';
import { isValidDate } from '../../../common/date';
import { renderJson } from '../../../common/renderer';
import { StatusReport, StatusReportStore } from '../../../common/storage/statusReport';
import { Presenter } from '../../presenter';


const router = express.Router();
const PageSize = 60;
const reportEpoch = new Date(Date.parse('2020-09-01T00:00:00.000Z'));

interface ReportsNameRequest extends express.Request {
    params: {
        name: string;      // string
    }
    query: {
        start_date: string // date
    }
}

/**
 * PUBLIC API
 */
router.get('/reports/:name.json', async function (req: ReportsNameRequest, res: express.Response) {
    let entities: Array<StatusReport> = [];

    const startDate = new Date(Date.parse(req.query.start_date));
    if (!isValidDate(startDate)) {
        return res.status(400)
            .json(Presenter.badRequest(`start_date '${req.query.start_date}' is invalid. Provide a valid ISO 8601 UTC format.`));
    }

    const minsFromNow = new Date();
    minsFromNow.setMinutes(minsFromNow.getMinutes() - PageSize);
    if (startDate.getTime() > minsFromNow.getTime()) {
        return res.status(400)
            .json(Presenter.badRequest(`start_date value must be at least ${PageSize} minutes from now.`));
    }

    // const now = new Date();
    // if (startDate.getTime() > now.getTime()) {
    //     return res.status(400)
    //         .json(Presenter.badRequest(`start_date cannot be set in the future.`));
    // }

    if (startDate.getTime() < reportEpoch.getTime()) {
        return res.status(400)
            .json(Presenter.badRequest(`start_date value cannot be before ${reportEpoch}`));
    }

    try {
        entities = await StatusReportStore.getReports(req.params.name, PageSize, startDate);
        res.type('json')
            .send(renderJson(Presenter.statusReports(entities)));
    } catch (error) {
        res.status(503)
            .json(Presenter.serverUnavailable(error));
    }
});

module.exports = router;