import express from 'express';
import { renderJson } from '../renderer';
import { ReportsDB, StatusReport } from '../storage/report';


const router = express.Router();

interface ReportsNameRequest extends express.Request {
    params: {
        name: string;
        unit: string;
    }
}

router.get('/reports/:name.json', async function (req: ReportsNameRequest, res: express.Response) {
    try {
        const entities: Array<StatusReport> = await ReportsDB.getLastHour(req.params.name);
        entities.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);

        res.type('json')
            .send(renderJson(entities));
    } catch (error) {
        return res.status(401)
            .json({ ok: false, message: error.message });
    }

});

module.exports = router;