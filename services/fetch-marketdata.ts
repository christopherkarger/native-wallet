import firebase, { firebaseDB } from "./firebase-init";

interface IHistoryItem {
  date: number;
  price: number;
}

export interface IMarketData {
  [key: string]: {
    history: IHistoryItem[];
    price: number;
  };
}
export const fetchMarketData = (
  callback: (data: IMarketData, db: firebaseDB) => void
) => {
  const db = firebase.database().ref("/marketData");
  return db.on("value", (snapshot) => {
    const data = snapshot.val();
    callback(data, db);
    return data;
  });
};