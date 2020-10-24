import express from 'express';
import { EmailRequest } from '../../email';
import { sendContactUs } from '../../email/contact';
import { captcha } from '../../middleware/captcha';
import { Presenter } from '../../presenter';

const router = express.Router();

interface ContactUsRequest extends express.Request {
  body: {
    name: string; // string
    email: string; // string
    message: string; // string
  };
}

router.post('/private/contact_us.json', captcha, async function (
  req: ContactUsRequest,
  res: express.Response
) {
  try {
    const emailRequest: EmailRequest = {
      email: req.body.email,
      message: req.body.message,
      subject: `StatusAPI: Please contact ${req.body.name}`,
    };

    await sendContactUs(emailRequest);

    res.sendStatus(200);
  } catch (error) {
    res.status(503).json(Presenter.serverUnavailable(error));
  }
});

module.exports = router;
