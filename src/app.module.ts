import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { CatsService } from './cats/cats.service';

@Module({
  imports: [EmailModule],
  controllers: [AppController],
  providers: [AppService, CatsService],
})
export class AppModule {}
