import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  origin: process.env.ORIGIN,
  database_url: process.env.DATABASE_URL,
};
