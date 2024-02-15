import { Generated, Kysely, Migration, Migrator } from "kysely";
import { SQLocalKysely } from "sqlocal/kysely";

/* --------------------------------- Schema --------------------------------- */

export interface DB {
  notes: NotesTable;
}

export interface NotesTable {
  id: Generated<number>;
  subject: string;
  document: string;
  createdAt: Date;
  isDeleted: boolean;
}

/* ---------------------------------- Setup --------------------------------- */

const { dialect } = new SQLocalKysely("reflect-lite.sqlite3");
const db = new Kysely<DB>({ dialect });

/* ------------------------------- Migrations ------------------------------- */

const migrations: Record<string, Migration> = {
  "001_initial": {
    up: async (db: Kysely<any>) => {
      console.log("running migration 001");

      await db.schema
        .createTable("notes")
        .addColumn("id", "integer", (col) => col.primaryKey())
        .addColumn("subject", "text", (col) => col.notNull())
        .addColumn("document", "text", (col) => col.notNull())
        .addColumn("createdAt", "timestamp", (col) => col.notNull())
        .addColumn("isDeleted", "integer", (col) => col.notNull())
        .execute();

      await db
        .insertInto("notes")
        .values([
          {
            subject: "Hello world",
            document: "How are you today?",
            createdAt: new Date().getTime(),
            isDeleted: false,
          },
        ])
        .execute();

      console.log("migration 001 done!");
    },
    down: async (db: Kysely<any>) => {
      await db.schema.dropTable("notes").execute();
    },
  },
};

const migrator = new Migrator({
  db,
  provider: { getMigrations: async () => migrations },
});

/* ---------------------------- Getting instance ---------------------------- */

export const getDb = async () => {
  console.log("getting db...");

  await migrator.migrateToLatest();

  return db;
};
