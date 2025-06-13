import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './mail.service';
import { MailTriggerService } from './mail-trigger.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Global()
@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mailConfig = {
          host: config.get<string>('SMTP_HOST'),
          port: config.get<number>('SMTP_PORT'),
          secure: false,
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASS'),
          },
        };

        if (!mailConfig.host || !mailConfig.port || !mailConfig.auth.user || !mailConfig.auth.pass) {
          throw new Error('Mail configuration is incomplete. Check MAIL_HOST, MAIL_PORT, MAIL_USER, and MAIL_PASS in .env');
        }

        return {
          transport: mailConfig,
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [EmailService, MailTriggerService],
  exports: [EmailService, MailTriggerService],
})
export class MailModule {}