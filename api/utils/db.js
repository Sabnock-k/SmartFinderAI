import pkg from 'pg';
const { Pool } = pkg;

var localdev = true;

const pool = new Pool({
  connectionString: localdev ? process.env.LOCAL_DATABASE_URL : process.env.DATABASE_URL,
  ssl: localdev ? false : { rejectUnauthorized: false },
});

export default pool;
