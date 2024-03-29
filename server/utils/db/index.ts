import { existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { Kysely, sql, SqliteDialect } from "kysely";
import sqlite from 'better-sqlite3';
import type { DBUser } from '~/types/auth';

const logger = useLog('db')
logger.info('initializing auth database')

// Get DB Path
const { configPath } = useRuntimeConfig()
export const dbPath = `${configPath}/.auth/db.sqlite`

// Make sure DB exists
if (!existsSync(dirname(dbPath))) mkdirSync(dirname(dbPath), { recursive: true })

export const rawDB = new sqlite(dbPath);

export const db = new Kysely<Database>({
    dialect: new SqliteDialect({
        database: rawDB
    })
});

// Define Database
interface SessionTable {
    id: string;
    user_id: string;
    expires_at: number;
}

interface Database {
    user: DBUser;
    session: SessionTable;
}

// Ensure DB is using WAL mode
rawDB.exec("PRAGMA journal_mode = WAL;");

// Create db tables if they don't exist already

db.schema
    .createTable('user')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('username', 'text', (col) => col.notNull().unique())
    .addColumn('role', 'text', (col) => col.notNull().defaultTo('user').check(sql`role in ('admin', 'user')`))
    .addColumn('hashedPassword', 'text', (col) => col.notNull())
    .ifNotExists()
    .execute()

// rawDB.exec(`CREATE TABLE IF NOT EXISTS user (
//     id TEXT NOT NULL PRIMARY KEY,
//     username TEXT NOT NULL UNIQUE,
//     role TEXT CHECK(role in ('admin', 'user')) NOT NULL DEFAULT 'user',
//     passwordHash TEXT NOT NULL
// )`);

db.schema
    .createTable('session')
    .addColumn('id', 'text', (col) => col.notNull())
    .addColumn('user_id', 'text', (col) => col.notNull().references('user.id'))
    .addColumn('expires_at', 'integer', (col) => col.notNull())
    .ifNotExists()
    .execute()

// rawDB.exec(`CREATE TABLE IF NOT EXISTS session (
//     id TEXT NOT NULL PRIMARY KEY,
//     user_id TEXT NOT NULL,
//     expires_at INTEGER NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES user(id)
// )`);

export const adapter = new BetterSqlite3Adapter(rawDB, {
    user: 'user',
    session: 'session'
});

logger.info('database initialized')



