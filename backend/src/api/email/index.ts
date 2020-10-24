import { Config } from '../../common/config';
import nodemailer from 'nodemailer';
import { message } from 'aws-sdk/clients/sns';

export interface EmailRequest {
  email: string;
  subject: string;
  message: message;
}

export const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: Config.EMAIL,
    pass: Config.EMAIL_PASSWORD,
  },
});
