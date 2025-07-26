import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MAIL_QUEUE } from './constants/mail.constants';
import { MailJob } from './enums/mail-job.enum';


@Injectable()
export class MailProducer {
  constructor(@InjectQueue(MAIL_QUEUE) private mailQueue: Queue) {}

  async sendTestEmail(recipient: string): Promise<void> {
    await this.mailQueue.add(MailJob.PLAIN_TEXT_MAIL, {
      recipient,
    });
  }

  async sendEmailWithTemplate(recipient: string): Promise<void> {
    await this.mailQueue.add(MailJob.TEMPLATE_MAIL, {
      templateId: process.env.SENDGRID_OTP_TEMPLATE_ID,
      recipient,
    });
  }
}
