import express from 'express';
import toJson from 'json-stable-stringify';
import { StatusReportStore } from '../../common/storage/statusReport';

export function renderJson(x: any): string {
    return toJson(x, { space: '  ' });
}

const router = express.Router();

router.get('/monitor/last_written.json', async function (req: express.Request, res: express.Response) {
    const lookBackMins = 3;
    const lookBackDate: Date = new Date();
    lookBackDate.setMinutes(lookBackDate.getMinutes() - lookBackMins);

    try {
        const statusReport = await StatusReportStore.getLatest();
        const lastWritten = { last_written: statusReport };

        if (lookBackDate < statusReport.endDate) {
            res.type('json')
                .status(200)
                .send(renderJson(lastWritten));
        } else {
            console.error(`Last written is too old ${statusReport.endDate}`);
            res.type('json')
                .status(500)
                .send(renderJson(lastWritten));
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

module.exports = router;