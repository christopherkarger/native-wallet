import * as SQLite from "expo-sqlite";
import { CryptoIcon } from "./models/crypto-icon";

const dbName = "wallets";

const db = SQLite.openDatabase(`${dbName}.db`);

export interface ILocalWallet {
  address: string;
  name: string;
  currency: string;
  balance: number;
  fetchedDate: number;
  id: number;
  icon: CryptoIcon;
  connectedToId?: number;
}

interface ISQLResult extends SQLite.SQLResultSet {
  rows: {
    _array: ILocalWallet[];
    length: number;
    item(index: number): any;
  };
}

export const createLocalDBTable = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${dbName} (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, currency TEXT NOT NULL, address TEXT NOT NULL, balance INTEGER NOT NULL, fetchedDate INTEGER NOT NULL, connectedToId INTEGER);`,
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

export const insertItemToLocalDB = (
  name: string,
  currency: string,
  address: string,
  balance: number,
  fetchedDate: number,
  connectedToId?: number
) => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${dbName} (name, currency, address, balance, fetchedDate, connectedToId) VALUES (?,?,?,?,?,?);`,
        [name, currency, address, balance, fetchedDate, connectedToId],
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

export const selectLocalDBTable = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${dbName}`,
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

export const dropLocalDBTable = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE IF EXISTS ${dbName}`,
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

export const updateItemToLocalDB = (id: number, balance: number) => {
  return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${dbName} SET balance = ? WHERE id = ?`,
        [balance, id],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const deleteItemFromLocalDB = (id: number) => {
  return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${dbName} WHERE id = ?`,
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};
