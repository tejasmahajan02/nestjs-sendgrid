import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MAIL_QUEUE } from './constants/mail.constants';
import { MailQueueJob } from './enums/mail-queue-job.enum';
import { PlainMailData, TemplateMailData } from './types/mail-data.type';

@Injectable()
export class MailProducer {
  constructor(@InjectQueue(MAIL_QUEUE) private mailQueue: Queue) {}

  async sendPlainMail(mailData: PlainMailData): Promise<void> {
    await this.mailQueue.add(MailQueueJob.PLAIN_TEXT_MAIL, mailData);
  }

  async sendTemplateMail(mailData: TemplateMailData): Promise<void> {
    await this.mailQueue.add(MailQueueJob.TEMPLATE_MAIL, mailData);
  }
}
