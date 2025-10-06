import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

// E change lang ni if mag local dev ka or deploy
// Set localdev to false if mag deploy naka
// var localdev = false;
var localdev = false;

const pool = new Pool({
  connectionString: localdev ? process.env.LOCAL_DATABASE_URL : process.env.DATABASE_URL,
  ssl: localdev ? false : { rejectUnauthorized: false },
});

export default pool;
