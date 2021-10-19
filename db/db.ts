import * as SQLite from "expo-sqlite";

const dbName = "appLocalDB";

export const db = SQLite.openDatabase(`${dbName}.db`);
