import express from 'express';
import { captcha } from '../../middleware/captcha';

const router = express.Router();

interface ContactUsRequest extends express.Request {
  body: {
    name: string; // string
    email: string; // string
    message: string; // string
  };
}

router.post('/private/contact_us.json', captcha, function (
  req: ContactUsRequest,
  res: express.Response
) {
  console.log(req.body);

  //   try {
  //     const entities: Array<StatusReport> = await StatusReportStore.getLastErrorsAll(
  //       MaxLatestFailures
  //     );
  //     return res.type("json").send(renderJson(Presenter.statusReports(entities)));
  //   } catch (error) {
  //     return res.status(503).json(Presenter.serverUnavailable(error));
  //   }
  res.json({});
});

module.exports = router;
