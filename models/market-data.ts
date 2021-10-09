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
   */
  get itemsByMarketCap(): IMarketDataItem[] {
    return this.items.sort((a, b) => {
      return a.data.rank - b.data.rank;
    });
  }
}
