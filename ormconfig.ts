import 'dotenv/config';
import { OracleConnectionOptions } from 'typeorm/driver/oracle/OracleConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

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
  logging: ['query', 'error'],
};

const postgresConfig: PostgresConnectionOptions = {
  type: 'postgres',
  name: 'postgresConnection',
  host: process.env.POSTGRES_URL,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PSWD,
  database: process.env.POSTGRES_DB,
  entities: [],
  synchronize: true,
  logging: ['query', 'error'],
};

export { oracleConfig, postgresConfig };
