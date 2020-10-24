import express from 'express';
import { StatusReportMetadataCache } from '../../cache/statusReportMetadataCache';
import { renderJson } from '../../../common/renderer';
import {
  StatusReportMetadata,
  StatusReportMetadataDB,
} from '../../../common/storage/statusReportMetadata';
import { StatusApiReportQueryDB } from '../../storage/searchQueries';
import { Presenter } from '../../presenter';

const router = express.Router();

router.get('/private/report_metadata/:key.json', async function (
  req: express.Request,
  res: express.Response
) {
  try {
    const statusReportMetadata = await StatusReportMetadataDB.get(
      req.params.key
    );

    res
      .type('json')
      .send(
        renderJson(Presenter.statusReportMetadatas([statusReportMetadata]))
      );
  } catch (error) {
    return res.status(503).json({ ok: false, message: error.message });
  }
});

interface ReportMetadataQueryRequest extends express.Request {
  query: {
    q: string;
  };
}

router.get('/private/report_metadata.json', async function (
  req: ReportMetadataQueryRequest,
  res: express.Response
) {
  // async + anonymously log query for insight into which API to onboard next
  if (req.query.q) {
    StatusApiReportQueryDB.save(req.query.q);
  }

  try {
    const query = req.query.q
      ? StatusReportMetadataCache.get(req.query.q)
      : StatusReportMetadataDB.all();
    const entities: Array<StatusReportMetadata> = await query;

    res
      .type('json')
      .send(renderJson(Presenter.statusReportMetadatas(entities)));
  } catch (error) {
    return res.status(503).json({ ok: false, message: error.message });
  }
});

module.exports = router;
