// src/mail/mail-trigger.service.ts
import { Injectable } from '@nestjs/common';
import { EmailService } from './mail.service';

type TriggerFn = (to: string, context?: any) => Promise<any>;

@Injectable()
export class MailTriggerService {
  constructor(private readonly mail: EmailService) {}

  private triggers: Record<string, TriggerFn> = {
    'user:welcome': (to, context) => 
      this.mail.sendTemplateEmail(to, 'welcome', context),

    'admin:alert': (to, context) =>
      this.mail.sendTemplateEmail(to, 'admin-alert', context),

    'user:plain-welcome': (to) =>
      this.mail.sendPlainEmail(to, 'Welcome!', 'Thanks for signing up!'),
    'forgot-password':(to,context)=>
        this.mail.sendTemplateEmail(to,'forgot-password',context)
  };

  async trigger(triggerKey: string, payload: { to: string; context?: any }) {
    const triggerFn = this.triggers[triggerKey];
    if (!triggerFn) {
      throw new Error(`Unknown email trigger: ${triggerKey}`);
    }
    return triggerFn(payload.to, payload.context);
  }
}
