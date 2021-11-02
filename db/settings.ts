import * as SQLite from "expo-sqlite";
import {
  DefaultCurrency,
  DefaultLanguage,
  SupportedCurrencies,
  SupportedLanguages,
} from "~/models/context";
import { db } from "./db";

const tableSettings = "settings";

export interface ILocalSettings {
  id: number;
  activeLanguage: string;
  activeCurrency: string;
}

interface ISQLResult extends SQLite.SQLResultSet {
  rows: {
    _array: ILocalSettings[];
    length: number;
    item(index: number): any;
  };
}

const createLocalDBTableSettings = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableSettings} (id INTEGER PRIMARY KEY NOT NULL, activeLanguage TEXT NOT NULL, activeCurrency TEXT NOT NULL);`,
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

interface ISaveSettings {
  activeLanguage?: SupportedLanguages;
  activeCurrency?: SupportedCurrencies;
}

const saveSettingsToLocalDBTableSettings = async (x: ISaveSettings) => {
  const settings = await selectLocalDBTableSettings();
  if (settings && settings.rows.length) {
    const localSettings = settings.rows._array[0] as ILocalSettings;
    await db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${tableSettings} SET activeLanguage = ?, activeCurrency = ? WHERE id = ${localSettings.id};`,
        [
          x.activeLanguage ?? localSettings.activeLanguage,
          x.activeCurrency ?? localSettings.activeCurrency,
        ],
        (_, result) => {},
        (_, error) => {
          console.error(error);
          return true;
        }
      );
    });
  } else {
    await db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${tableSettings} (activeLanguage, activeCurrency) VALUES (?,?);`,
        [
          x.activeLanguage ?? DefaultLanguage,
          x.activeCurrency ?? DefaultCurrency,
        ],
        (_, result) => {},
        (_, error) => {
          console.error(error);
          return true;
        }
      );
    });
  }
};

const dropLocalDBTableSettings = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE ${tableSettings}`,
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

const selectLocalDBTableSettings = () => {
  return new Promise<ISQLResult>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableSettings};`,
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
  createLocalDBTableSettings,
  saveSettingsToLocalDBTableSettings,
  selectLocalDBTableSettings,
  dropLocalDBTableSettings,
};
