import pg from 'pg';
const { Pool } = pg;

const Db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default Db;
