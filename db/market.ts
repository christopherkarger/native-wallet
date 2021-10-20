import * as SQLite from "expo-sqlite";
import { db } from "./db";

const tableMarket = "market";

export interface ILocalMarket {
  id: number;
  name: string;
  currency: string;
  price: number;
  lastFetched: number;
  rank: number;
  history?: string; // array stored as string
  lastDayHistory?: string; // array stored as string
}

interface ISQLResult extends SQLite.SQLResultSet {
  rows: {
    _array: ILocalMarket[];
    length: number;
    item(index: number): any;
  };
}

const createLocalDBTableMarket = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableMarket} (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, price INTEGER NOT NULL, currency TEXT NOT NULL, rank INTEGER NOT NULL, lastFetched INTEGER NOT NULL, history TEXT NOT NULL, lastDayHistory TEXT NOT NULL);`,
        [],
        (_, result) => {
          resolve(<ISQLResult>result);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

const insertItemToLocalDBTableMarket = (
  name: string,
  price: number,
  currency: string,
  rank: number,
  lastFetched: number,
  history: string,
  lastDayHistory: string
) => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${tableMarket} (name, price, currency, rank, lastFetched, history, lastDayHistory) VALUES (?,?,?,?,?,?,?);`,
        [name, price, currency, rank, lastFetched, history, lastDayHistory],
        (_, result) => {
          resolve(<ISQLResult>result);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

const selectLocalDBTableMarket = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableMarket}`,
        [],
        (_, result) => {
          resolve(<ISQLResult>result);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export {
  createLocalDBTableMarket,
  insertItemToLocalDBTableMarket,
  selectLocalDBTableMarket,
};
