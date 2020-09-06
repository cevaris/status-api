import express from 'express';
import { StatusReportMetadataCache } from '../cache/statusReportMetadataCache';
import { renderJson } from '../../common/renderer';
import { StatusReportMetadata, StatusReportMetadataDB } from '../../common/storage/statusReportMetadata';
import { StatusApiReportQueryDB } from '../storage/searchQueries';


const router = express.Router();

router.get('/report_metadata/:key.json', async function (req: express.Request, res: express.Response) {
    try {
        const statusReportMetadata = await StatusReportMetadataDB.get(req.params.key);
        res.type('json')
            .send(renderJson(statusReportMetadata));
    } catch (error) {
        return res.status(401)
            .json({ ok: false, message: error.message });
    }
});

interface ReportMetadataQueryRequest extends express.Request {
    query: {
        q: string;
    }
}

router.get('/report_metadata.json', async function (req: ReportMetadataQueryRequest, res: express.Response) {
    const maxResults = 30;
    // async + anonymously log query for insight into which API to onboard next
    if (req.query.q) {
        StatusApiReportQueryDB.save(req.query.q);
    }

    try {
        const query = req.query.q ?
            StatusReportMetadataCache.get(req.query.q) : StatusReportMetadataDB.all();
        const entities: Array<StatusReportMetadata> = await query;
        entities.sort((a, b) => (a.key > b.key) ? 1 : -1);

        res.type('json')
            .send(renderJson(entities));
    } catch (error) {
        return res.status(401)
            .json({ ok: false, message: error.message });
    }
});

module.exports = router;