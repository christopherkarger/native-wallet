import { EURO_STABLECOIN } from "~/constants";
import { ILocalMarket } from "~/db";

export interface IMarketDataItem {
  name: string;
  data: IMarketDataItemData;
}

export interface IHistoryItem {
  date: number;
  price: number;
}

export interface IMarketDataItemData {
  history: IHistoryItem[];
  lastDayHistory: IHistoryItem[];
  price: number;
  currency: string;
  rank: number;
  lastFetched: number;
}

export class MarketData {
  constructor(readonly items: IMarketDataItem[]) {}

  /**
   * Finds item by name
   */
  findItemByName(name: string): IMarketDataItem | undefined {
    return this.items.find((x) => x.name === name);
  }

  /**
   * return items by market cap
   * and filters stablecoin EUR
   */
  get itemsByMarketCap(): IMarketDataItem[] {
    return this.items
      .sort((a, b) => {
        return a.data.rank - b.data.rank;
      })
      .filter((m) => m.name !== EURO_STABLECOIN);
  }
}

export const localMarketDataToClass = (localMarketData: ILocalMarket[]) => {
  return new MarketData(
    localMarketData.map((item) => {
      return {
        name: item.name,
        data: {
          lastFetched: item.lastFetched,
          price: item.price,
          rank: item.rank,
          currency: item.currency,
          history: item.history ? JSON.parse(item.history) : [],
          lastDayHistory: item.lastDayHistory
            ? JSON.parse(item.lastDayHistory)
            : [],
        },
      };
    })
  );
};
