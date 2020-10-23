import axios from 'axios';
import express from 'express';
import { Config } from '../../common/config';

// https://www.joshmorony.com/adding-captcha-to-ionic-with-nodejs-middleware/

export const captcha = async function (
  req: express.Request,
  res: express.Response,
  next: Function
) {
  if (!req.body.captcha) {
    return res.status(400).json({ message: 'missing captcha parameter' });
  }

  const urlEncodedData =
    `secret=${Config.RECAPTCHA_SECRET_KEY}&response=` +
    req.body.captcha +
    '&remoteip=' +
    req.connection.remoteAddress;

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      urlEncodedData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (response.data.success) {
      next();
    } else {
      console.error(response.data);
      res
        .status(401)
        .json({ message: 'Bot activity detected, rejecting request!' });
    }
  } catch (err) {
    console.log(err);
    res
      .status(503)
      .json({ message: 'Bot activity detected, rejecting request!' });
  }
};
