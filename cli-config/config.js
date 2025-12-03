// config.js
import dotenv from 'dotenv';
dotenv.config();

const {
  NODE_ENV,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  // Production SSL
  DB_SSL
} = process.env;

const isProduction = NODE_ENV === 'production';
const useSSL = DB_SSL === 'true';

const config = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: `${DB_NAME}_test`,
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'postgres',
    logging: false,
    ssl: useSSL,
    dialectOptions: useSSL
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : undefined
  }
};

// Export all environments (optional)
export default config;