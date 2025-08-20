import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDataRequired, default as SendGrid } from '@sendgrid/mail';
import { prettyStringify } from 'src/common/utils/helpers.util';

@Injectable()
export class SendGridService {
  private readonly logger = new Logger(SendGridService.name);

  constructor(private readonly configService: ConfigService) {
    // Get the API key from config service or environment variable
    SendGrid.setApiKey(this.configService.getOrThrow('SENDGRID_API_KEY'));
  }

  async send(mail: MailDataRequired): Promise<void> {
    try {
      await SendGrid.send(mail);
      this.logger.log(`Email successfully dispatched to: ${mail.to as string}`);
    } catch (error) {
      this.logger.error(`Error while sending email to :${mail.to as string}`);
      console.error(prettyStringify(error));
      // throw error;
    }
  }
}

// NOTE You have to set "esModuleInterop" to true in your tsconfig file to be able to use the default key in import.
