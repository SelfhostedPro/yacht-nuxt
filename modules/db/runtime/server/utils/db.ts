import { existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { Kysely, sql, SqliteDialect } from "kysely";
import sqlite from 'better-sqlite3';
import { configPaths } from '~~/modules/config/runtime/server/utils/config'
import type { DBUser, DBUserPrivate } from '../../../types/user';
// import type { DBUser } from '~~/types/auth';
// import { useConfigDir } from './config';

// Define Database
interface SessionTable {
    id: string;
    user_id: string;
    expires_at: number;
}

interface Database {
    user: DBUserPrivate;
    session: SessionTable;
}


const init = (dbPath: string) => {
    let exists: boolean = true
    if (!existsSync(dirname(dbPath))) {
        mkdirSync(dirname(dbPath), { recursive: true })
        exists = false;
        Logger.info(`Database not found. Creating new one.`)
    }
    const rawDB = new sqlite(dbPath);
    // Ensure DB is using WAL mode
    rawDB.exec("PRAGMA journal_mode = WAL;");

    // Make sure DB exists
    if (!exists) {
        console.log('Creating user table.')
        rawDB.exec(`CREATE TABLE IF NOT EXISTS user (
            id TEXT NOT NULL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            role TEXT CHECK(role in ('admin', 'user')) NOT NULL DEFAULT 'user',
            hashedPassword TEXT NOT NULL
        )`);
        console.log('User table created')

        console.log('Creating Session Table')
        rawDB.exec(`CREATE TABLE IF NOT EXISTS session (
        id TEXT NOT NULL PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id)
        )`);
        console.log('Session table created')

    }
    return rawDB
}

export const useRawDB = () => {
    // Get DB Path
    // const { configPath } = useRuntimeConfig()
    const configPath = configPaths.auth
    const dbPath = `${configPath}/db.sqlite`
    const rawDB = init(dbPath)

    return rawDB
}

export const useDB = () => {
    return new Kysely<Database>({
        dialect: new SqliteDialect({
            database: useRawDB()
        })
    });
}

export const useDBAdapter = () => {
    const db = useRawDB()
    return new BetterSqlite3Adapter(db, {
        user: 'user',
        session: 'session'
    });
}

export const oldInitDB = async () => {
    const db = useDB()

    // Create db tables if they don't exist already
    await db.schema
        .createTable('user')
        .addColumn('id', 'text', (col) => col.primaryKey())
        .addColumn('username', 'text', (col) => col.notNull().unique())
        .addColumn('role', 'text', (col) => col.notNull().defaultTo('user').check(sql`role in ('admin', 'user')`))
        .addColumn('hashedPassword', 'text', (col) => col.notNull())
        .ifNotExists()
        .execute()

    await db.schema
        .createTable('session')
        .addColumn('id', 'text', (col) => col.notNull())
        .addColumn('user_id', 'text', (col) => col.notNull().references('user.id'))
        .addColumn('expires_at', 'integer', (col) => col.notNull())
        .ifNotExists()
        .execute()
}











