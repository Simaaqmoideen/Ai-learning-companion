const { Pool } = require("pg");

const databaseUrl = new URL(process.env.DATABASE_URL);

const pool = new Pool({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 5432),
  database: databaseUrl.pathname.replace(/^\//, ""),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password)
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
