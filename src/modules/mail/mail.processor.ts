import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailDataRequired } from '@sendgrid/mail';
import { MAIL_QUEUE } from './constants/mail.constants';
import { SendGridService } from './sendgrid.service';
import { MailJob } from './enums/mail-job.enum';
import { ConfigService } from '@nestjs/config';
import { PlainMailData, TemplateMailData } from './types/mail-data.type';

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  private defaultMailConfig: Pick<MailDataRequired, 'from'>;

  constructor(
    private readonly sendGridService: SendGridService,
    private readonly configService: ConfigService,
  ) {
    super();

    this.defaultMailConfig = {
      from: {
        email: this.configService.getOrThrow('SENDGRID_SENDER_MAIL_ID'),
        name: 'NestJS SendGrid',
      },
    };
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { data, name } = job;
    switch (name) {
      case MailJob.PLAIN_TEXT_MAIL:
        await this.sendPlainMail(data);
        break;
      case MailJob.TEMPLATE_MAIL:
        await this.sendTemplateMail(data);
        break;
      default:
        this.logger.log(
          `Mail failed dispatched to: ${data.to}; No Job Matched.`,
        );
        break;
    }

    return {};
  }

  async sendPlainMail({ to, subject, body }: PlainMailData): Promise<void> {
    const mail: MailDataRequired = {
      ...this.defaultMailConfig,
      to,
      subject,
      content: [{ type: 'text/plain', value: body }],
    };
    await this.sendGridService.send(mail);
  }

  async sendTemplateMail({
    to,
    templateId,
    subject,
    templateData,
  }: TemplateMailData): Promise<void> {
    const mail: MailDataRequired = {
      ...this.defaultMailConfig,
      to,
      templateId,
      dynamicTemplateData: { body: templateData, subject }, // The data to be used in the template
    };
    await this.sendGridService.send(mail);
  }
}
