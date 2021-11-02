import * as SQLite from "expo-sqlite";
import { Wallet } from "../models/wallet";
import { WalletWrapper } from "../models/wallet-wrapper";
import { db } from "./db";

const tableWallets = "wallets";

export interface ILocalWallet {
  id: number;
  name: string;
  address: string;
  currency: string;
  balance: number;
  lastFetched: number;
  connectedToId?: number;
  demoAddress?: number;
}

interface ISQLResult extends SQLite.SQLResultSet {
  rows: {
    _array: ILocalWallet[];
    length: number;
    item(index: number): any;
  };
}

const resetLocalDbWallets = async () => {
  await deleteAllFromLocalDBTableWallets();
};

const createLocalDBTableWallets = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableWallets} (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, currency TEXT NOT NULL, address TEXT NOT NULL, balance INTEGER NOT NULL, lastFetched INTEGER NOT NULL, connectedToId INTEGER, demoAddress INTEGER);`,
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

const insertItemToLocalDBTableWallets = (
  name: string,
  currency: string,
  address: string,
  balance: number,
  lastFetched: number,
  connectedToId?: number,
  demoAddress?: number
) => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${tableWallets} (name, currency, address, balance, lastFetched, connectedToId, demoAddress) VALUES (?,?,?,?,?,?,?);`,
        [
          name,
          currency,
          address,
          balance,
          lastFetched,
          connectedToId,
          demoAddress,
        ],
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

const selectLocalDBTableWallets = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableWallets}`,
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

const deleteAllFromLocalDBTableWallets = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${tableWallets}`,
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

const updateItemBalanceToLocalDBTableWallets = (
  id: number,
  balance: number
) => {
  return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${tableWallets} SET balance = ? WHERE id = ?`,
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

const updateItemConnectedToIdToLocalDBTableWallets = (
  id: number,
  newId?: number
) => {
  return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${tableWallets} SET connectedToId = ? WHERE id = ?;`,
        [newId, id],
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

const deleteSingleItemFromLocalDBTableWallets = (id: number) => {
  return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${tableWallets} WHERE id = ?;`,
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

const deleteMainItemFromLocalDBTableWallets = (
  item: Wallet,
  walletWrapper: WalletWrapper
) => {
  return new Promise<SQLite.SQLResultSet>(async (resolve, reject) => {
    const secondWalletID = walletWrapper.wallets[1].id;
    const wallets = walletWrapper.wallets
      .slice()
      .filter((e) => e.connectedToId)
      .map((w) => w.clone());

    // Update new main wallet address
    try {
      await updateItemConnectedToIdToLocalDBTableWallets(wallets[0].id);
    } catch {
      reject(
        "deleteMainItemFromLocalDBTableWallets - failed to update first item"
      );
    }

    // Delete first one
    wallets.shift();

    // update all other wallet address
    for (const w of wallets) {
      if (w.connectedToId) {
        try {
          await updateItemConnectedToIdToLocalDBTableWallets(
            w.id,
            secondWalletID
          );
        } catch {
          reject(
            "deleteMainItemFromLocalDBTableWallets - failed to update item"
          );
        }
      }
    }

    // Delete main wallet address
    try {
      const deletedItem = await deleteSingleItemFromLocalDBTableWallets(
        item.id
      );
      resolve(deletedItem);
    } catch {
      reject(
        "deleteMainItemFromLocalDBTableWallets - failed to delete main item"
      );
    }
  });
};

const deleteItemFromLocalDBTableWallets = (
  item: Wallet,
  walletWrapper: WalletWrapper
) => {
  if (item.connectedToId || walletWrapper.wallets.length == 1) {
    return deleteSingleItemFromLocalDBTableWallets(item.id);
  } else {
    return deleteMainItemFromLocalDBTableWallets(item, walletWrapper);
  }
};

export {
  createLocalDBTableWallets,
  deleteItemFromLocalDBTableWallets,
  deleteMainItemFromLocalDBTableWallets,
  deleteSingleItemFromLocalDBTableWallets,
  insertItemToLocalDBTableWallets,
  resetLocalDbWallets,
  selectLocalDBTableWallets,
  updateItemBalanceToLocalDBTableWallets,
  updateItemConnectedToIdToLocalDBTableWallets,
};
