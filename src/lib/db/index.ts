import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as path from 'path';
import * as schema from '../schema/index';

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), 'data.db');

export const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

// Run migrations if they exist
try {
  migrate(db, { migrationsFolder: 'src/lib/schema/migrations' });
} catch (e) {
  // Migrations folder might not exist yet, that's ok
}
