import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

let state;

export function getDatabase() {
  if (state) return state;

  const databasePath = path.resolve(process.env.DATABASE_PATH || '.data/monoblogue.db');
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const sqlite = new Database(databasePath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('busy_timeout = 5000');
  sqlite.exec(fs.readFileSync(path.resolve('migrations/0000_initial.sql'), 'utf8'));

  state = { sqlite, db: drizzle(sqlite, { schema }) };
  return state;
}
