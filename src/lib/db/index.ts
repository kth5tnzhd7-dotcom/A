import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../schema';
import * as path from 'path';

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), 'data.db');

export const sqlite = new Database(dbPath);

// Create tables if they don't exist
try {
  // Users table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      credits REAL NOT NULL DEFAULT 0,
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

  // URL clicks table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS url_clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url_id INTEGER NOT NULL,
      ip TEXT,
      country TEXT,
      city TEXT,
      user_agent TEXT,
      referrer TEXT,
      timestamp INTEGER,
      FOREIGN KEY (url_id) REFERENCES shortened_urls(id)
    )
  `);

  // SMS campaigns table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sms_campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      message TEXT NOT NULL,
      total_recipients INTEGER NOT NULL,
      sent_count INTEGER NOT NULL DEFAULT 0,
      failed_count INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      cost REAL NOT NULL DEFAULT 0,
      scheduled_at INTEGER,
      created_at INTEGER,
      completed_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // SMS recipients table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sms_recipients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL,
      phone_number TEXT NOT NULL,
      country TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      sent_at INTEGER,
      delivered_at INTEGER,
      FOREIGN KEY (campaign_id) REFERENCES sms_campaigns(id)
    )
  `);

  // Hosted websites table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS hosted_websites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      subdomain TEXT NOT NULL UNIQUE,
      custom_domain_id INTEGER,
      storage_used INTEGER NOT NULL DEFAULT 0,
      bandwidth_used INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      created_at INTEGER,
      updated_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (custom_domain_id) REFERENCES custom_domains(id)
    )
  `);

  // Website files table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS website_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      website_id INTEGER NOT NULL,
      path TEXT NOT NULL,
      content BLOB,
      content_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at INTEGER,
      FOREIGN KEY (website_id) REFERENCES hosted_websites(id)
    )
  `);

  // Telegram bots table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS telegram_bots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      bot_username TEXT NOT NULL,
      token TEXT NOT NULL,
      chat_id TEXT,
      custom_domain_id INTEGER,
      webhook_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      messages_sent INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (custom_domain_id) REFERENCES custom_domains(id)
    )
  `);

  // Bot commands table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS bot_commands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bot_id INTEGER NOT NULL,
      command TEXT NOT NULL,
      description TEXT NOT NULL,
      response TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (bot_id) REFERENCES telegram_bots(id)
    )
  `);

  // Subscriptions table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan TEXT NOT NULL,
      status TEXT NOT NULL,
      amount REAL NOT NULL,
      current_period_start INTEGER NOT NULL,
      current_period_end INTEGER NOT NULL,
      created_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Transactions table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      status TEXT NOT NULL,
      created_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log('Database tables initialized');
} catch (e) {
  console.error('Failed to initialize database:', e);
}

export const db = drizzle(sqlite, { schema });
