import * as SQLite from "expo-sqlite";
import { db } from "./db";

const tableAddressUpdate = "addressUpdate";

export interface ILocalAddressUpdate {
  id: number;
  date: number;
  count: number;
}

interface ISQLResult extends SQLite.SQLResultSet {
  rows: {
    _array: ILocalAddressUpdate[];
    length: number;
    item(index: number): any;
  };
}

export const createLocalDBTableAddressUpdate = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableAddressUpdate} (id INTEGER PRIMARY KEY NOT NULL, date INTEGER NOT NULL, count INTEGER NOT NULL);`,
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

export const saveLocalDBTableAddressUpdate = async (
  date: number,
  count: number
) => {
  const addressUpdate = await selectLocalDBTableAddressUpdate();
  if (addressUpdate && addressUpdate.rows.length) {
    return updatetItemToLocalDBTableAddressUpdate(date, count);
  } else {
    return insertItemToLocalDBTableAddressUpdate(date, count);
  }
};

export const updatetItemToLocalDBTableAddressUpdate = (
  date: number,
  count: number
) => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${tableAddressUpdate} SET date = ?, count = ? WHERE id = 1`,
        [date, count],
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

export const insertItemToLocalDBTableAddressUpdate = (
  date: number,
  count: number
) => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${tableAddressUpdate} (date, count) VALUES (?,?);`,
        [date, count],
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

export const selectLocalDBTableAddressUpdate = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableAddressUpdate}`,
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

export const deleteLocalDBTableAddressUpdate = () => {
  return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${tableAddressUpdate};`,
        [],
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
