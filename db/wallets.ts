import * as SQLite from "expo-sqlite";
import { Wallet } from "../models/wallet";
import { WalletWrapper } from "../models/wallet-wrapper";
import { db } from "./db";

const tableWallets = "wallets";

export interface ILocalWallet {
  readonly id: number;
  readonly name: string;
  readonly currency: string;
  readonly balance: number;
  readonly isCoinWallet: number;
  readonly isDemoAddress: number;
  readonly addedAt?: number;
  readonly coinPrice?: number;
  readonly address?: string;
  readonly lastFetched?: number;
  readonly connectedToId?: number;
}

interface IWalletInsertInput {
  readonly name: string;
  readonly currency: string;
  readonly balance: number;
  readonly isCoinWallet: boolean;
  readonly isDemoAddress: boolean;
  readonly addedAt?: number;
  readonly coinPrice?: number;
  readonly address?: string;
  readonly lastFetched?: number;
  readonly connectedToId?: number;
}

interface ISQLResult extends SQLite.SQLResultSet {
  rows: {
    _array: ILocalWallet[];
    length: number;
    item(index: number): any;
  };
}

export const resetLocalDbWallets = async () => {
  await deleteAllFromLocalDBTableWallets();
};

export const createLocalDBTableWallets = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableWallets} (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, currency TEXT NOT NULL, balance INTEGER NOT NULL, isCoinWallet INTEGER NOT NULL, isDemoAddress INTEGER NOT NULL, addedAt INTEGER, coinPrice INTEGER, address TEXT, lastFetched INTEGER, connectedToId INTEGER);`,
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

export const insertItemToLocalDBTableWallets = (x: IWalletInsertInput) => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${tableWallets} (name, currency, balance, isCoinWallet, isDemoAddress, addedAt, coinPrice, address, lastFetched, connectedToId) VALUES (?,?,?,?,?,?,?,?,?,?);`,
        [
          x.name,
          x.currency,
          x.balance,
          x.isCoinWallet ? 1 : 0,
          x.isDemoAddress ? 1 : 0,
          x.addedAt,
          x.coinPrice,
          x.address,
          x.lastFetched,
          x.connectedToId,
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

export const selectLocalDBTableWallets = () => {
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

export const dropLocalDBTableWallets = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE ${tableWallets}`,
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

export const updateItemBalanceToLocalDBTableWallets = (
  id: number,
  balance: number,
  lastFetched: number
) => {
  return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${tableWallets} SET balance = ?, lastFetched = ? WHERE id = ?`,
        [balance, lastFetched, id],
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

export const updateItemConnectedToIdToLocalDBTableWallets = (
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

export const deleteSingleItemFromLocalDBTableWallets = (id: number) => {
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

export const deleteMainItemFromLocalDBTableWallets = (
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

export const deleteItemFromLocalDBTableWallets = (
  item: Wallet,
  walletWrapper: WalletWrapper
) => {
  if (item.connectedToId || walletWrapper.wallets.length == 1) {
    return deleteSingleItemFromLocalDBTableWallets(item.id);
  } else {
    return deleteMainItemFromLocalDBTableWallets(item, walletWrapper);
  }
};

export const getExistingWalletId = async (name: string) => {
  const localWallets = await selectLocalDBTableWallets().catch(() => {});
  if (localWallets && localWallets.rows.length) {
    const wallets = localWallets.rows._array.filter((l) => {
      return (
        l.name === name &&
        (l.connectedToId === null || l.connectedToId === undefined)
      );
    });

    if (wallets.length === 1) {
      return wallets[0].id;
    }
  }
};
