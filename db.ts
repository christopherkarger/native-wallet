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

// export const saveLocalListToDB = async (list: IListItem[]) => {
//   try {
//     await dropLocalDBTable();
//   } catch (err) {
//     throw new Error("DROP TABLE FAILED");
//   }

//   try {
//     await createLocalDBTable();
//   } catch (err) {
//     throw new Error("CREATE TABLE FAILED");
//   }

//   if (list.length > 0) {
//     try {
//       await insertListToLocalDB(list);
//     } catch (err) {
//       throw new Error("INSERT INTO TABLE FAILED");
//     }
//   }
// };

// export const getLocalTableBD = () => {
//   try {
//     return selectLocalDBTable();
//   } catch (err) {
//     throw new Error("SELECTING * FROM TABLE FAILED");
//   }
// };

// const dropLocalDBTable = () => {
//   return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "DROP TABLE IF EXISTS items",
//         [],
//         (_, result) => {
//           resolve(result);
//         },
//         (_, error) => {
//           reject(error);
//           return true;
//         }
//       );
//     });
//   });
// };

// const insertListToLocalDB = (list: IListItem[]) => {
//   return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
//     db.transaction((tx) => {
//       const stm = `INSERT INTO items (value, checked) VALUES ${list
//         .map((x, i) => {
//           return `${i > 0 ? " " : ""}('${x.value}', ${x.checked ? 1 : 0})`;
//         })
//         .toString()};`;

//       tx.executeSql(
//         stm,
//         [],
//         (_, result) => {
//           resolve(result);
//         },
//         (_, error) => {
//           reject(error);
//           return true;
//         }
//       );
//     });
//   });
// };

// export const insertItemToLocalDB = (title: string, checked: boolean) => {
//   return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "INSERT INTO items (title, checked) VALUES (?,?);",
//         [title, checked ? 1 : 0],
//         (_, result) => {
//           resolve(result);
//         },
//         (_, error) => {
//           reject(error);
//           return true;
//         }
//       );
//     });
//   });
// };

// export const deleteItemToLocalDB = (id: number) => {
//   return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "DELETE FROM items WHERE id = ?",
//         [id],
//         (_, result) => {
//           resolve(result);
//         },
//         (_, error) => {
//           reject(error);
//           return true;
//         }
//       );
//     });
//   });
// };

// export const updateItemToLocalDB = (
//   id: number,
//   title: string,
//   checked: boolean
// ) => {
//   return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "UPDATE items SET title = ?, checked = ? WHERE id = ?",
//         [title, checked ? 1 : 0, id],
//         (_, result) => {
//           resolve(result);
//         },
//         (_, error) => {
//           reject(error);
//           return true;
//         }
//       );
//     });
//   });
// };
