import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { DB_PORT, DB_URL } from '../config';

const dbConnection: ConnectionOptions = {
  type: 'mysql',
  url: DB_URL,
  port: Number(DB_PORT),
  synchronize: false,
  logging: false,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
  subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};

export = dbConnection;
