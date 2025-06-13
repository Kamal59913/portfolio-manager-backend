// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    noReplyFrom!:any;
    constructor(private mailer: MailerService,private config:ConfigService) {
        this.noReplyFrom = this.config.get('MAIL_FROM_NO_REPLY');

    }
    
    async sendTemplateEmail(to: string, template: string, context: any, from?: string) {
      console.log("got here on this part",  from)
    return this.mailer.sendMail({
      to,
      subject: `📧 ${template.replace(/[-_]/g, ' ').toUpperCase()}`,
      template,
      context,
      ...(from ? { from } : {from:this.noReplyFrom}), // only add if provided
    });
  }
  
  async sendPlainEmail(to: string, subject: string, text: string, from?: string) {

    return this.mailer.sendMail({
      to,
      subject,
      text,
      ...(from ? { from } : {from:this.noReplyFrom}),
    });
  }
  
}
