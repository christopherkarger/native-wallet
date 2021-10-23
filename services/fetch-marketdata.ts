import {
  IHistoryItem,
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
    const m = new MarketData(
      Object.keys(data).map((key) => {
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
      })
    );

    callback(m, db);
  });
};
