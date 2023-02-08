import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { oracleConfig, postgresConfig } from '../ormconfig';
import { RecordsModule } from './records/records.module';

@Module({
  // imports: [TypeOrmModule.forRoot(oracleConfig), EmailModule],
  imports: [TypeOrmModule.forRoot(postgresConfig), EmailModule, RecordsModule],
  // imports: [EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
