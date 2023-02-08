import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
// import { oracleConfig, postgresConfig } from '../ormconfig';
import { RecordsModule } from './records/records.module';

@Module({
  // imports: [TypeOrmModule.forRoot(oracleConfig), EmailModule],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // name: 'postgresConnection', TODO: Figure out why app breaks if name is included
      host: process.env.POSTGRES_URL,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PSWD,
      database: process.env.POSTGRES_DB,
      // entities: [Record],
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      logging: ['query', 'error'],
    }),
    RecordsModule,
    EmailModule,
    // RecordsModule,
  ],
  // imports: [EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
