import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../schema/index';
import * as path from 'path';

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), 'data.db');

export const sqlite = new Database(dbPath);

// Create tables if they don't exist
try {
  // Users table with all required columns
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      country TEXT NOT NULL DEFAULT 'Unknown',
      browser TEXT NOT NULL DEFAULT 'Unknown',
      device_info TEXT,
      credits REAL NOT NULL DEFAULT 0,
      wallet_balance REAL NOT NULL DEFAULT 0,
      email_verified INTEGER NOT NULL DEFAULT 0,
      phone_verified INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

  // Custom domains table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS custom_domains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      domain TEXT NOT NULL UNIQUE,
      verified INTEGER NOT NULL DEFAULT 0,
      ssl_enabled INTEGER NOT NULL DEFAULT 0,
      service_type TEXT NOT NULL,
      service_id TEXT NOT NULL,
      created_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Shortened URLs table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS shortened_urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      original_url TEXT NOT NULL,
      short_code TEXT NOT NULL UNIQUE,
      custom_domain_id INTEGER,
      clicks INTEGER NOT NULL DEFAULT 0,
      expires_at INTEGER,
      created_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (custom_domain_id) REFERENCES custom_domains(id)
    )
  `);

  console.log('Database tables initialized successfully');
} catch (e) {
  console.error('Failed to initialize database:', e);
}

export const db = drizzle(sqlite, { schema });
