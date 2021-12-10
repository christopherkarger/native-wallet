import AsyncStorage from "@react-native-async-storage/async-storage";
import { IMarketDataItem, MarketData } from "~/models/market-data";

export const saveMarketDataToStorage = async (marketData: MarketData) => {
  try {
    await AsyncStorage.setItem(
      "@market_data",
      JSON.stringify(marketData.items)
    );
  } catch (err) {
    console.error(err);
  }
};

export const getLocalStorageMarketData = async () => {
  try {
    const markeData = await AsyncStorage.getItem("@market_data");
    if (markeData) {
      return new MarketData(JSON.parse(markeData) as IMarketDataItem[]);
    }
  } catch (err) {
    console.error(err);
  }
};
