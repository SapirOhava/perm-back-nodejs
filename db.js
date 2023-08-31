const Pool = require('pg').Pool;
require('dotenv').config();

// were instance this pool and set up our configurations
const pool = new Pool({
  user: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  host: 'localhost',
  port: 5432,
  database: 'perntodo',
});
