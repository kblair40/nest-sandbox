import 'dotenv/config';
import { OracleConnectionOptions } from 'typeorm/driver/oracle/OracleConnectionOptions';

import { Email } from './src/email/entities/email.entity';

const username = process.env.ORACLEDB_USER;
console.log('\nUSERNAME:', username, '\n');

const oracleConfig: OracleConnectionOptions = {
  type: 'oracle',
  //name: 'oracleDS',
  username: process.env.ORACLEDB_USER,
  password: process.env.ORACLEDB_PSWD,
  connectString: process.env.ORACLEDB_URL,
  // entities: ['dist/**/*.entity{.ts,.js}'],
  entities: [Email],
  synchronize: false,
  // migrations: ['dist/src/db/migrations/*.oracle.js'],
  // cli: { migrationsDir: 'src/db/migrations' },
  logging: ['query', 'error'],
};

export { oracleConfig };
