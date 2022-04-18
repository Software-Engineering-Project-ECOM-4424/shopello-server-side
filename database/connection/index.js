'use strict';
const { Pool } = require('pg');
require('dotenv').config()

const {
  env: {
    NODE_ENV,
    TEST_DB_URL,
    DB_URL,
    DB_USER,
    DB_HOST,
    DB_DATABASE,
    DB_PASSWORD,
    DB_PORT
  },
} = process;

let dbUrl = '';
let options = null;
switch (NODE_ENV) {
  case 'production':
    dbUrl = DB_URL;
    options = {
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    };
    break;
  case 'development':

    options = {
      user: DB_USER,
      host: DB_HOST,
      database: DB_DATABASE,
      password: DB_PASSWORD,
      port: DB_PORT,
    }
    break;
  case 'test':
    options = {
      user: DB_USER,
      host: DB_HOST,
      database: DB_TEST_DATABASE,
      password: DB_PASSWORD,
      port: DB_PORT,
    }
    break;
  default:
    throw new Error('NO DATABASE URL Founded !');
}


module.exports = new Pool(options);