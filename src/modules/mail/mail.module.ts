import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MAIL_QUEUE } from './constants/mail.constants';
import { MailProcessor } from './mail.processor';
import { MailProducer } from './mail.producer';
import { SendGridService } from './sendgrid.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: MAIL_QUEUE,
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  providers: [MailProcessor, MailProducer, SendGridService],
  exports: [MailProducer],
})
export class MailModule {}
