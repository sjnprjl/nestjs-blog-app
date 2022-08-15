import 'dotenv/config';

interface IDatabase {
  database: string;
  host: string;
  port: number;
  password: string;
  username: string;
}

export const DB: IDatabase = {
  database: process.env.DB_NAME,
  port: +process.env.DB_PORT,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
};
