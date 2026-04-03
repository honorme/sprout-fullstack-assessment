const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const sqlPath = path.join(__dirname, '../../db/schema.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

pool
  .query(sql)
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
