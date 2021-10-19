import * as SQLite from "expo-sqlite";
export const db = SQLite.openDatabase(`appLocalDB.db`);
