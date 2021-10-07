import { IMarketDataItemData, MarketData } from "~/models/market-data";
import firebase, { firebaseDB } from "./firebase-init";

interface IResponse {
  [key: string]: IMarketDataItemData;
}

export const fetchMarketData = (
  callback: (data: MarketData, db: firebaseDB) => void
) => {
  const db = firebase.database().ref("/marketData");
  return db.on("value", (snapshot) => {
    const dbSnapshot = snapshot.val();
    const data: IResponse = !!dbSnapshot ? dbSnapshot : {};
    const m = new MarketData(
      Object.keys(data).map((key) => {
        return {
          name: key,
          data: {
            price: data[key].price,
            rank: data[key].rank,
            currency: data[key].currency,
            history: data[key].history
              ? data[key].history.map((h: any) => ({
                  date: h.date,
                  price: h.price,
                }))
              : [],
          },
        };
      })
    );

    callback(m, db);
    return data;
  });
};
