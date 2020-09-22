import {
  MongoClient,
  Database,
} from 'https://deno.land/x/mongo@v0.12.1/mod.ts';

let db: Database;

export function connect() {
  const client = new MongoClient();
  client.connectWithUri('mongodb://127.0.0.1:27017');

  db = client.database('todo-app');
}

export function getDb() {
  return db;
}
