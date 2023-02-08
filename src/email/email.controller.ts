import { Controller, Post, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EmailService } from './email.service';
// import { Email } from './entities/email.entity';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  parseCSV() {
    return this.emailService.parseCSV();
  }

  @Post()
  sendEmail() {
    this.emailService.sendEmail();
  }
}
