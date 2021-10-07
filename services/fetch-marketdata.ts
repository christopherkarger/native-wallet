import firebase, { firebaseDB } from "./firebase-init";

interface IHistoryItem {
  date: number;
  price: number;
}

export interface IMarketDataItem {
  history: IHistoryItem[];
  price: number;
  currency: string;
  rank: number;
}

export interface IMarketData {
  [key: string]: IMarketDataItem;
}
export const fetchMarketData = (
  callback: (data: IMarketData | null, db: firebaseDB) => void
) => {
  const db = firebase.database().ref("/marketData");
  return db.on("value", (snapshot) => {
    const data: IMarketData | null = snapshot.val();
    callback(data, db);
    return data;
  });
};
