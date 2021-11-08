import * as SQLite from "expo-sqlite";
export const db = SQLite.openDatabase(`cryptoLocalDB.db`);
