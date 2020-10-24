import { SentMessageInfo } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { config } from 'process';
import { EmailRequest, mailTransporter } from '.';
import { Config } from '../../common/config';

export async function sendContactUs(request: EmailRequest): Promise<void> {
  const userMessage = `${request.message}

Thank you for contacting us. 
We will respond back shortly.
- Adam`;

  const userDetails = {
    from: Config.EMAIL_STATUS_API,
    to: request.email,
    cc: Config.EMAIL_STATUS_API,
    subject: request.subject,
    text: userMessage,
  };
  // const userDetails: MailOptions = {
  //   from: Config.EMAIL_STATUS_API,
  //   to: request.email,
  //   replyTo: request.email,
  //   subject: request.subject,
  //   text: userMessage,
  // };

  const userPromise: SentMessageInfo = await mailTransporter.sendMail(
    userDetails
  );
  console.log('sendContactUs', userPromise);
}
