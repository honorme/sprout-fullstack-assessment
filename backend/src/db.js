const { Pool } = require('pg');
const { pgPoolOptions } = require('./pgConfig');

const pool = new Pool(pgPoolOptions());

module.exports = { pool };
