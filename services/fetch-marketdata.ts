import {
  IHistoryItem,
  IMarketDataItem,
  IMarketDataItemData,
  MarketData,
} from "~/models/market-data";
import firebase, { firebaseDB } from "./firebase-init";

interface IResponse {
  [key: string]: IMarketDataItemData;
}

export const fetchMarketData = (
  callback: (data: MarketData, db: firebaseDB) => void
) => {
  const db = firebase.database().ref("/marketData");
  db.on("value", (snapshot) => {
    const dbSnapshot = snapshot.val();
    const data: IResponse = !!dbSnapshot ? dbSnapshot : {};
    const mData = Object.keys(data).map((key) => {
      return {
        name: key,
        data: {
          lastFetched: data[key].lastFetched,
          price: data[key].price,
          rank: data[key].rank,
          currency: data[key].currency,
          history: data[key].history
            ? data[key].history.map((item: IHistoryItem) => ({
                date: item.date,
                price: item.price,
              }))
            : [],
          lastDayHistory: data[key].lastDayHistory
            ? data[key].lastDayHistory.map((item: IHistoryItem) => ({
                date: item.date,
                price: item.price,
              }))
            : [],
        },
      };
    });
    callback(new MarketData(filterDoubleDate(mData)), db);
  });
};

/**
 * Filters possible double today dates
 * because of timezones
 * if there are 2 today dates.
 * delete the older value
 */
const filterDoubleDate = (items: IMarketDataItem[]): IMarketDataItem[] => {
  return items.map((item) => {
    if (item.data.history.length > 1) {
      const date1 = new Date(
        item.data.history[item.data.history.length - 2].date
      );
      const date2 = new Date(
        item.data.history[item.data.history.length - 1].date
      );

      if (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      ) {
        // Delete older second date
        item.data.history = item.data.history.filter(
          (_, i) => i !== item.data.history.length - 2
        );
      }
    }

    return item;
  });
};
