import pg from "pg";
import {
  host,
  dbname,
  username,
  password,
  port,
  databaseURL,
} from "../config.js";

console.log(host);

const pool = new pg.Pool({
  // connection from heroku
  connectionString: databaseURL,
  ssl: { rejectUnauthorized: false },
});

export async function query(text, params, callback) {
  return pool.query(text, params, callback);
}
