import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EmailService } from './email.service';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  sendEmail() {
    this.emailService.sendEmail();
  }
}
