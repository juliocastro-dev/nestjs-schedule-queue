import { Module } from '@nestjs/common';
import { SendMailWithTweetsJob } from './send-email-with-tweets.job';

@Module({
    providers: [SendMailWithTweetsJob]
})
export class MailingModule {}
