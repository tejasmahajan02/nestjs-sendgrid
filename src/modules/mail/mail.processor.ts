import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailDataRequired } from '@sendgrid/mail';
import { MAIL_QUEUE } from './constants/mail.constants';
import { SendGridService } from './sendgrid.service';
import { MailJob } from './enums/mail-job.enum';
import { ConfigService } from '@nestjs/config';

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
        email: this.configService.getOrThrow('SENDGRID_SENDER_EMAIL_ID'),
        name: 'NestJS SendGrid',
      },
    };
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { recipient, templateId } = job.data;
    switch (job.name) {
      case MailJob.PLAIN_TEXT_MAIL:
        await this.sendTestEmail(recipient);
        break;
      case MailJob.TEMPLATE_MAIL:
        await this.sendEmailWithTemplate(templateId, recipient);
        break;
      default:
        this.logger.log(
          `Email failed dispatched to: ${recipient}; No Job Matched.`,
        );
        break;
    }

    return {};
  }

  async sendTestEmail(
    recipient: string,
    subject: string = 'Test email',
    body: string = 'This is a test mail',
  ): Promise<void> {
    const mail: MailDataRequired = {
      ...this.defaultMailConfig,
      to: recipient,
      subject,
      content: [{ type: 'text/plain', value: body }],
    };
    await this.sendGridService.send(mail);
  }

  async sendEmailWithTemplate(
    templateId: string,
    recipient: string,
    subject: string = 'Test email with template',
    body: string = 'This is a test mail with template',
  ): Promise<void> {
    const mail: MailDataRequired = {
      ...this.defaultMailConfig,
      to: recipient,
      templateId,
      dynamicTemplateData: { body, subject }, // The data to be used in the template
    };
    await this.sendGridService.send(mail);
  }
}
