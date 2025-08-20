import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MailProducer } from './modules/mail/mail.producer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sample Mail Testing
  const mailProducer = app.get(MailProducer);
  await mailProducer.sendPlainMail({
    to: process.env.SENDGRID_DEFAULT_RECIPIENT_MAIL_ID!,
    subject: `NestJS SendGrid Restarted Successfully`,
    body: `NestJS SendGrid Restarted Successfully On ${new Date().toLocaleDateString()}`,
  });

  await app.listen(process.env.NODE_PORT ?? 3000);
  console.log(`This application is running on: ${await app.getUrl()}`);
}
bootstrap();
