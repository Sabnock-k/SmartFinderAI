import bcrypt from "bcrypt";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export async function loginUser(username, password) {
    const result = await pool.query(
        `SELECT * FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1) LIMIT 1`, [username]
    );

    if (result.rows.length === 0) {
        throw new Error("Invalid username or password");
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
        throw new Error("Invalid username or password");
    }

    return user;
}

export async function registerUser(username, full_name, email, password) {
    const exists = await pool.query(
        `SELECT * FROM users WHERE username = $1 OR email = $2 LIMIT 1`, [username, email]
    );

    if (exists.rows.length > 0) {
        throw new Error("Username or email already exists");
    }

    const password_hash = await bcrypt.hash(password, 10);

    await pool.query(
        `INSERT INTO users (username, full_name, email, password_hash) VALUES ($1, $2, $3, $4)`, [username, full_name, email, password_hash]
    );

    return { message: "Registration successful" };
}