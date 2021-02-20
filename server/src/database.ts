import { Database } from 'sqlite3'; 
import { open } from 'sqlite';
 
export async function init() {
    const db = await open({
        filename: './database.db',
        driver: Database,
    });
 
    await db.exec(`
        CREATE TABLE IF NOT EXISTS pessoa (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            nome      TEXT NOT NULL,
            sobrenome TEXT NOT NULL,
            apelido   TEXT NOT NULL UNIQUE
        )
    `);
 
    return db;
}